import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    context.log('HTTP trigger function processed a request.');

    const responseJSON = {
      "name": "name",
      "sport": "sport",
      "message": "message",
      "success": true
    }
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseJSON,
        contentType: 'application/json'
    };

};

export default httpTrigger;
