import { NextResponse } from 'next/server';
import { createClient } from './server';
import { errorToast } from '@/components/ToasterProvider';

export async function updateSession(request) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = await createClient()

    // Check for an authenticated session
    const { data: { user } } = await supabase.auth.getUser();

    // console.log(user)

    if (!user) {
      // If there's no user, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = '/landing-page';
      return NextResponse.redirect(url);
    }



    // If there's a user, proceed with the request
    return supabaseResponse;
  } catch (error) {
    // Handle network errors or Supabase-specific issues
    if (!navigator.onLine) {
      errorToast("You are offline. Please check your internet connection.");
      console.log("You are offline. Please check your internet connection.");
    } else {
      errorToast("Something went wrong. Please try again.");
      console.log("Something went wrong. Please try again.");
    }
    console.log( 'this is error from supabse folder', error)
  }
}
