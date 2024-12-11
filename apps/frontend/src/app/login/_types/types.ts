export type LoginFormProps = {
    onSubmit: (email: string, password: string) => void;
};

export type GoogleLoginButtonProps = {
    onClick: () => void;
};