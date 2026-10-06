import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import { getUserRole } from '../get-user-role'

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	})

	// Create a Supabase client
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
					supabaseResponse = NextResponse.next({
						request,
					})
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options),
					)
				},
			},
		},
	)

	// Get the current user from Supabase
	const {
		data: { user },
	} = await supabase.auth.getUser()

	console.log('user', user)

	// Get the user's role using the custom getUserRole function
	const role = await getUserRole()

	// Redirect non-admin users trying to access admin pages to the home page
	if (user && role !== 'admin' && request.nextUrl.pathname.startsWith('/admin')) {
		const url = request.nextUrl.clone()
		url.pathname = '/inicio'
		return NextResponse.redirect(url)
	}

	// Visitors landing on the root see the product page, not the login wall
	if (!user && request.nextUrl.pathname === '/') {
		const url = request.nextUrl.clone()
		url.pathname = '/produto'
		return NextResponse.redirect(url)
	}

	// Redirect unauthenticated users to sign-in page
	if (
		!user &&
		!request.nextUrl.pathname.startsWith('/login') &&
		!request.nextUrl.pathname.startsWith('/auth')
	) {
		const url = request.nextUrl.clone()
		url.pathname = '/login'
		url.searchParams.set('next', request.nextUrl.pathname)
		return NextResponse.redirect(url)
	}

	// Redirect authenticated users attempting to access the sign-in page to the home page
	if (user && request.nextUrl.pathname.startsWith('/login')) {
		const url = request.nextUrl.clone()
		url.pathname = '/inicio'
		return NextResponse.redirect(url)
	}

	// redirect authenticated users from '/' to '/inicio'
	if (user && request.nextUrl.pathname === '/') {
		const url = request.nextUrl.clone()
		url.pathname = '/inicio'
		return NextResponse.redirect(url)
	}

	return supabaseResponse
}
