import { Item } from './item.model' 

export interface ServerResponse {
    error: string,
    data: Array<Item>
}