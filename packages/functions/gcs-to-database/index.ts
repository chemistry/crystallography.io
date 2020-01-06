import {
  PubSubContext
} from '@chemistry/common-functions';

/**
 * Will react on file changes and store to Cloud Database
 */
export async function getGCSAndStoreToDataBase(
  data: any,
  context: PubSubContext
) {

    console.log(`data: ${JSON.stringify(data)}`);
    console.log(`context: ${JSON.stringify(context)}`);
}
