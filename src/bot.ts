import { ActivityTypes, ConversationState, TurnContext } from 'botbuilder';
import { StatePropertyAccessor } from 'botbuilder-core';
import {
    ChoicePrompt,
    DialogSet,
    DialogTurnStatus,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext
} from 'botbuilder-dialogs';
import * as _ from 'underscore';
import { isNullOrUndefined } from 'util';
import { ITimeAndWeatherService } from './services/i-time-and-weather.service';
import { TimeAndWeatherService } from './services/time-and-weather.service';
import { MockTimeAndWeatherService } from './services/mock-time-and-weather.service';

export class MyBot {

    private static readonly DIALOG_STATE_PROPERTY = 'dialogState';
    private static readonly PARENT_DIALOG_ID = 'cityInformationDialog';
    private static readonly CHOOSE_CITY_DIALOG_ID = 'chooseCityPrompt';
    private static readonly CITY_OPTIONS = ['Warsaw', 'London', 'New York', 'Berlin', 'Other'];
    private static readonly TYPE_CITY_ID = 'typeCityPrompt';

    private readonly dialogState: StatePropertyAccessor;
    private dialogs: DialogSet;

    private readonly timeAndWeatherService: ITimeAndWeatherService =
        process.env.MOCK_BACKEND === 'true'
            ? new MockTimeAndWeatherService()
            : new TimeAndWeatherService();

    constructor(private conversationState: ConversationState) {
        this.dialogState = this.conversationState.createProperty(MyBot.DIALOG_STATE_PROPERTY);
        this.dialogs = new DialogSet(this.dialogState);
        this.dialogs.add(new ChoicePrompt(MyBot.CHOOSE_CITY_DIALOG_ID));
        this.dialogs.add(new TextPrompt(MyBot.TYPE_CITY_ID));
        this.dialogs.add(new WaterfallDialog(MyBot.PARENT_DIALOG_ID, [
            this.sendCityChoice.bind(this),
            this.reactToCityChoice.bind(this),
            this.reactToManualCityChoice.bind(this)
        ]));
    }

    public onTurn = async (turnContext: TurnContext) => {
        switch (turnContext.activity.type) {
            case ActivityTypes.Message:
                await this.respondToUser(turnContext);
                break;
            case ActivityTypes.ConversationUpdate:
                if (this.hasUserJoined(turnContext)) {
                    await this.sendWelcomeMessage(turnContext);
                }
                break;
            default:
                console.log(turnContext.activity.type);
        }
        await this.conversationState.saveChanges(turnContext);
    }

    private hasUserJoined(turnContext: TurnContext): boolean {
        return isNullOrUndefined(_.findWhere(turnContext.activity.membersAdded, { id: turnContext.activity.recipient.id }));
    }

    private sendWelcomeMessage(turnContext: TurnContext) {
        const membersNamesArray = _.map(turnContext.activity.membersAdded, (member) => member.name);
        const membersNames = _.reduce(membersNamesArray, (member, secondMember) => {
            return member + ', ' + secondMember;
        });
        return turnContext.sendActivity('Hello ' + membersNames + ' from ASC LAB City Information Bot! ');
    }

    private async respondToUser(turnContext: TurnContext) {
        const dc = await this.dialogs.createContext(turnContext);
        if (!turnContext.responded) {
            const dialogResult = await dc.continueDialog();
            if (dialogResult.status === DialogTurnStatus.empty) {
                try {
                    const newDialogResult = await dc.beginDialog(MyBot.PARENT_DIALOG_ID);
                    console.log(`New dialog started, current status is ${newDialogResult.status}`);
                } catch (rejected) {
                    console.error(rejected);
                }
            }
        }
    }

    private async sendCityChoice(context: WaterfallStepContext) {
        return await context.prompt
            (MyBot.CHOOSE_CITY_DIALOG_ID, {
                choices: MyBot.CITY_OPTIONS,
                prompt: 'Please choose one of the most popular cities or choose "Other" if you ask about another.',
                retryPrompt: 'You did not provide expected value, could you try again?'
            });
    }

    private async reactToCityChoice(step: WaterfallStepContext) {
        const selectedCity = step.result.value;
        if (selectedCity === this.getLastFromCityOptions()) {
            return await step.prompt(MyBot.TYPE_CITY_ID, 'Please type manually city name');
        }
        await this.sendTimeAndWeatherInformation(step.context, selectedCity);
        return step.endDialog();
    }

    private async reactToManualCityChoice(step: WaterfallStepContext) {
        const selectedCity = step.result;
        await this.sendTimeAndWeatherInformation(step.context, selectedCity);
        return step.endDialog();
    }

    private async sendTimeAndWeatherInformation(context: TurnContext, city: string) {
        try {
            const timeAndWeatherResponse = await this.timeAndWeatherService.getTimeAndWeatherFor(city);
            const promises = [
                context.sendActivity(`Time for ${city} is: ${timeAndWeatherResponse.time}`),
                context.sendActivity(`Detailed weather information for  ${city} is: ${timeAndWeatherResponse.weather}`)
            ];
            return Promise.all(promises);
        } catch (error) {
            console.error(error);
            context.sendActivity(`Something went wrong`);
        }
    }

    private getLastFromCityOptions(): string {
        return MyBot.CITY_OPTIONS[MyBot.CITY_OPTIONS.length - 1];
    }

}
