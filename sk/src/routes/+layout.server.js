/** @type {import('./$types').LayoutServerLoad} */
export const load = async({locals}) =>{
	console.log(locals.user)
	return {
		user: locals.user
	}
}