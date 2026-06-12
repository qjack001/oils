
export async function processPost(request: Request) {
	if (request.method != 'POST') {
		return undefined
	}
	
	return await request.formData()
		.then((form) => form?.get('colour')?.toString())
}
