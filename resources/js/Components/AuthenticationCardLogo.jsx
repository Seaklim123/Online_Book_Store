export default function AuthenticationCardLogo({ className = "" }) {
    return (
        <div className={`mx-auto flex justify-center mb-6 ${className}`}>
            <img
                src="/images/jong an.png"
                alt="Logo"
                className="rounded-full object-cover shadow-md"
            />
        </div>
    );
}