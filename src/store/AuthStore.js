import { errorToast, successToast } from '@/components/ToasterProvider';
import { createClient } from '@/utils/supabase/client';
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
                // Display an error message to the user
                return false;
            }
            else if (data) {
                successToast('Sign Up done! Email sent for verification');
                set({ signUpEmail: email })
                return true;
            }
        } catch (err) {
            console.log('Sign-up failed:', err);
        }
    },

    VerifyUser: async (otp) => {
        try {
            const { data, error } = await supabase.auth.verifyOtp({ email: get().signUpEmail, token: otp, type: 'email' })

            if (!error) {
                successToast('User verification done successfully!');
                set({ signUpEmail: '' })
                // Display an error message to the user
                return true;
            }
            console.log('Error signing up:', error.message);
            errorToast("Error in Verifying", error.message);
            return false;
        } catch (err) {
            console.log('Sign-up failed:', err);
        }
    },

    ResendOtp: async () => {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: get().signUpEmail,
                options
            })

            if (!error) {
                successToast('OTP resent successfully!');
                return true;
            }
            console.log('Error resending OTP:', error.message);
            errorToast("Error in resending OTP", error.message);
            return false;
        } catch (err) {
            console.log('Resend OTP failed:', err);
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

                if (error) { errorToast("There was an error reseting your password."); return false }
                if (data) { successToast("Password reset successfully!"); return true; }
            }
        } catch (err) {
            console.log('Reset failed:', err);
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