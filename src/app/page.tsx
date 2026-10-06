import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/** The root is a router: signed-in users go to their month, visitors to the product page. */
export default async function Home() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	redirect(user ? '/inicio' : '/produto')
}
