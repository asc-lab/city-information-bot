import {ActivityTypes, ConversationState, TurnContext} from 'botbuilder';
import {StatePropertyAccessor} from 'botbuilder-core';
import {
    ChoicePrompt,
    DialogSet,
    DialogTurnStatus,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext
} from 'botbuilder-dialogs';
import * as _ from 'underscore';
import {isNullOrUndefined} from 'util';
import {ITimeAndWeatherService} from './services/i-time-and-weather.service';
import {TimeAndWeatherService} from './services/time-and-weather.service';

export class MyBot {

    private readonly dialogState: StatePropertyAccessor;
    private dialogs: DialogSet;
    private static readonly PARENT_DIALOG_ID = 'cityInformationDialog';

    constructor(private conversationState: ConversationState) {
        this.dialogState = this.conversationState.createProperty('dialogState');
        this.dialogs = new DialogSet(this.dialogState);

    }

    // --------------------- CODE GENERATED FROM YEOMAN WITH LITTLE CHANGES ------------------
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
        return isNullOrUndefined(_.findWhere(turnContext.activity.membersAdded, {id: turnContext.activity.recipient.id}));
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

    // --------------------- CODE GENERATED FROM YEOMAN WITH LITTLE CHANGES ------------------

}
