import { initializeDates } from '../../../common/utilities';
import { ServerMessage } from './models/Message';

function initializeServerMessages(serverMessages: ServerMessage[]) {
    initializeDates(serverMessages, 'time');
}

export { initializeServerMessages };
