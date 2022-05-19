import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { findAllTodos } from "../db/todos";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const todos =  findAllTodos();
    console.log({todos})
    context.res = {
        status: 200,
        body: todos
    };
};

export default httpTrigger;