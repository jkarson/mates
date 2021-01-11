import { ServerBill } from './Bill';
import { ServerBillGenerator } from './BillGenerator';

export interface ServerBillsInfo {
    bills: ServerBill[];
    billGenerators: ServerBillGenerator[];
}
