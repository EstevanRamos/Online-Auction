import PocketBase from 'pocketbase';

export const handle = async ({ event, resolve }) => {
    event.locals.pb = new PocketBase('http://127.0.0.1:8090');

    // load the store data from the request cookie string
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh()
			event.locals.user = event.locals.pb.authStore.model
		}
    } catch (_) {
        // clear the auth store on failed refresh
        event.locals.pb.authStore.clear();
        event.locals.user = null
    }

    const response = await resolve(event);

    // send back the default 'pb_auth' cookie to the client with the latest store state
    response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());

    return response;
}