export const usePasswordValidation = () => {
    const commonPasswords = [
        "password",
        "123456",
        "password123",
        "12345678",
        "qwerty",
        "abc123",
        "monkey",
        "letmein",
        "password1",
        "admin123",
    ];

    const validatePassword = (
        password: string,
        username?: string
    ): {
        isValid: boolean;
        errors: string[];
    } => {
        const errors: string[] = [];

        if (password.length < 8)
            errors.push("Password must be at least 8 characters long");
        if (!/[A-Z]/.test(password))
            errors.push("Must contain at least one uppercase letter");
        if (!/\d/.test(password))
            errors.push("Must contain at least one number");
        if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/\\~`]/.test(password))
            errors.push("Must contain at least one special character");

        if (commonPasswords.includes(password.toLowerCase())) {
            errors.push("Password is too common");
        }

        if (
            username &&
            username.length >= 3 &&
            password.toLowerCase().includes(username.toLowerCase())
        ) {
            errors.push("Password cannot contain your username");
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    };

    const calculateStats = (password: string) => {
        let score = 0;
        const maxScore = 10;

        if (password.length > 0) score += 1;
        if (password.length >= 8) score += 2;
        if (password.length >= 12) score += 1;
        if (password.length >= 14) score += 1;

        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/\d/.test(password)) score += 1;
        if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/\\~`]/.test(password)) score += 1;

        if (
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /\d/.test(password)
        ) {
            score += 1;
        }

        if (
            /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/\\~`]/.test(password) &&
            /\d/.test(password)
        ) {
            score += 1;
        }

        const finalScore = Math.min(score, maxScore);
        const percentage = Math.round((finalScore / maxScore) * 100);

        let strength: "very-weak" | "weak" | "medium" | "strong" = "very-weak";

        if (finalScore >= 8) strength = "strong";
        else if (finalScore >= 5) strength = "medium";
        else if (finalScore >= 3) strength = "weak";
        else strength = "very-weak";

        return { strength, percentage };
    };

    const getStrengthColor = (strength: string) => {
        if (strength === "very-weak") return "bg-red-600";
        if (strength === "weak") return "bg-red-400";
        if (strength === "medium") return "bg-yellow-500";
        return "bg-green-500";
    };

    const getStrengthText = (strength: string) => {
        if (strength === "very-weak") return "Very Weak";
        if (strength === "weak") return "Weak";
        if (strength === "medium") return "Medium";
        return "Strong";
    };

    return {
        validatePassword,
        calculateStats,
        getStrengthColor,
        getStrengthText,
    };
};
