import { pb } from "$lib/stores/auth.svelte";
import { redirect } from "@sveltejs/kit";

export const POST = async ({ locals }) => {
    if (locals.pb && locals.pb.authStore) {
        locals.pb.authStore.clear();
        locals.user = null;
    }
    throw redirect(303, '/');
};
