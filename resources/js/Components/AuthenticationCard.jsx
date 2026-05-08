export default function AuthenticationCard({ children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
                {children}
            </div>
        </div>
    );
}