import { errorToast, successToast } from '@/components/ToasterProvider';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import { create } from 'zustand';

const supabase = createClient();
const options = {
    redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/auth/callback`,
};


export const AuthStore = create((set, get) => ({

    signUpEmail: '',

    SignUpUser: async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options
            });

            if (error) {
                errorToast("Error signing up:", error.message);
                console.log('Error signing up:', error.message);
                // Display an error message to the user
                return false;
            }
            successToast('Success! Email sent for verification');
            set({ signUpEmail: email })
            return true;
        } catch (err) {
            console.log('Sign-up failed:', err);
        }
    },

    VerifyUser: async (otp) => {
        try {
            const { data, error } = await supabase.auth.verifyOtp({ email: get().signUpEmail, token: otp, type: 'email' })

            if (error) {
                errorToast("Error in Verifying", error.message);
                console.log('Error signing up:', error.message);
                // Display an error message to the user
                return false;
            }
            successToast('User verification done successfully!');
            set({ signUpEmail: '' })
            return true;
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
                errorToast("Login Error:", error.message);

                console.log('Error login up:', error.message);
                // Display an error message to the user
                return false;
            }
            successToast('Login Successfully');
            return true;
        } catch (err) {
            console.log('Sign-in failed:', err);
        }
    },

    ForgotPassword: async (email) => {

        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(
                email, {
                redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/reset-password`
            }
            );

            if (error) {
                errorToast("Forgot Password Error", error.message);
                console.log('Error login up:', error.message);
                // Display an error message to the user
                return false;
            }
            successToast('Email Sent Successfully');
            return true;
        } catch (err) {
            console.log('Sign-in failed:', err);
        }
    },

    isPasswordResetInitiated: false,

    InitiatePasswordReset: async () => {

        try {
            supabase.auth.onAuthStateChange(async (event, session) => {
                if (event == "PASSWORD_RECOVERY") {
                    set({ isPasswordResetInitiated: true });
                }
            })
        } catch (err) {
            console.log('Reset failed:', err);
        }
    },

    UpdatePassword: async (newPassword) => {
        try {

            if (!get().isPasswordResetInitiated) { errorToast('Unauthorized password reset!') }
            if (get().isPasswordResetInitiated) {
                const { data, error } = await supabase.auth
                    .updateUser({ password: newPassword })

                if (error) {errorToast("There was an error reseting your password."); return false}
                if (data) {successToast("Password reset successfully!"); return true;}
            }
        } catch (err) {
            console.log('Reset failed:', err);
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