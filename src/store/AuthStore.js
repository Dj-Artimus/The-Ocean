import { errorToast, successToast } from '@/components/ToasterProvider';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import { create } from 'zustand';

const supabase = createClient();
const options = {
    redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/auth/callback`,
};


export const AuthStore = create((set) => ({

    SignUpUser: async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options
            });

            if (error) {
                errorToast("Error signing up");
                console.log('Error signing up:', error.message);
                // Display an error message to the user
                return;
            }
            successToast('Success! Email sent for verification');
            redirect('/verify-email');
        } catch (err) {
            console.log('Sign-up failed:', err);
        }
    },

    Login: async (email, password) => {

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                errorToast("Error login up");
                console.log('Error login up:', error.message);
                // Display an error message to the user
                return;
            }
            successToast('Login Successfully');
            redirect('/');
        } catch (err) {
            console.log('Sign-in failed:', err);
        }
    },

    Logout: async () => {
        try {
            let { error } = await supabase.auth.signOut()
            if (error) {
                return console.log(error);
            }
            return successToast("Logout Successfully");
        } catch (error) {
            console.log(error);
            return errorToast('Logout Failed , Please try again !')
        }
    },

    OAuthLogin: async (provider) => {
        try {
            let { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options
            })
            if (error) {
                errorToast("Something went wrong, Please try again")
                return console.log(error);
            }
            return data
        } catch (error) {
            return console.log(error);
        }
    }

}))