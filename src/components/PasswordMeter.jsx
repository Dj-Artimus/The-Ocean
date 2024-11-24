'use client'
import { LinearProgress, Typography } from "@mui/material";

const PasswordCheck = (password) => { 
  let score = 0;
  if (password.length > 7) {
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  }
  return score;
}

const PasswordMeter = ({ password }) => {
  const passwordTest = {
    length: (password.length > 7),
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passwordStrengthCheck = (password) => {
    const score = PasswordCheck(password);
    
    if (score === 0) return "text-red-700";
    if (score === 1) return "text-red-500";
    if (score === 2) return "text-orange-600";
    if (score === 3) return "text-yellow-500";
    if (score === 4) return "text-green-600";
  };

  const calculateStrength = (pwd) => {
    let strength = 0;
    const requirements = [
      { regex: /.{8,}/, weight: 20 }, // At least 8 characters
      { regex: /[A-Z]/, weight: 20 }, // At least one uppercase letter
      { regex: /[a-z]/, weight: 20 }, // At least one lowercase letter
      { regex: /[0-9]/, weight: 20 }, // At least one number
      { regex: /[^A-Za-z0-9]/, weight: 20 }, // At least one special character
    ];

    requirements.forEach(({ regex, weight }) => {
      if (regex.test(pwd)) strength += weight;
    });
    return Math.min(100, strength);
  };

  const strength = calculateStrength(password);

  const getStrengthLabel = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength <= 20) return "Weak";
    if (strength <= 40) return "Fair";
    if (strength <= 60) return "Good";
    if (strength <= 80) return "Strong";
    return "Very Strong";
  };

  const getColor = (strength) => {
    if (strength <= 20) return "error";
    if (strength <= 40) return "warning";
    if (strength <= 60) return "info";
    if (strength <= 80) return "success";
    return "success";
  };

  return (
    <div>
      <div className="mb-2 text-[10px] text-gray-600 dark:text-d_text_clr">
        Password length should 
        <span className={`font-semibold ${passwordTest.length ? "text-green-400" : 'text-red-400'}`}> between 8 to 16 </span>
        and contain
        <span className={`font-semibold ${passwordTest.uppercase ? "text-green-400" : 'text-red-400'}`}> uppercase</span>, 
        <span className={`font-semibold ${passwordTest.lowercase ? "text-green-400" : 'text-red-400'}`}> lowercase</span>, 
        <span className={`font-semibold ${passwordTest.digit ? "text-green-400" : 'text-red-400'}`}> digit</span> and
        <span className={`font-semibold ${passwordTest.special ? "text-green-400" : 'text-red-400'}`}> #special</span> characters.
        <br></br>
        <span className={`font-bold ${passwordStrengthCheck(password)}`}>
          To keep you Safe
        </span>
      </div>
      <LinearProgress
        variant="determinate"
        value={strength}
        color={getColor(strength)}
        className="rounded-xl bg-gray-300"
      />
      <Typography
        variant="caption"
        className="text-text_clr dark:text-d_text_clr"
      >
        Password strength: {getStrengthLabel(strength)} ({strength}%)
      </Typography>
    </div>
  );
};

export default PasswordMeter;