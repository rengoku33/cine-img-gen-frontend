import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { GoogleLogin, googleLogout, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

type Message = {
  id?: number;
  type: 'user' | 'bot';
  text?: string;
  image?: string;
  isLoading?: boolean;
};

type User = {
  name: string;
  picture: string;
  email: string;
};

function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [attempts, setAttempts] = useState<number>(0);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Restore user and attempts from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedAttempts = localStorage.getItem('attempts');

    if (storedEmail && storedAttempts) {
      setUser({ name: storedEmail, picture: '', email: storedEmail });
      setAttempts(parseInt(storedAttempts));
    }
  }, []);

  const handleLoginSuccess = (response: CredentialResponse) => {
    if (response.credential) {
      const userObject: User = jwtDecode(response.credential);
      setUser(userObject);
      setAttempts(3);
      localStorage.setItem('email', userObject.email);
      localStorage.setItem('attempts', '3');
    }
  };

  const handleLoginFailure = () => {
    console.error('Login Failed');
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    setAttempts(0);
    setMessages([]);
    localStorage.removeItem('email');
    localStorage.removeItem('attempts');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (attempts <= 0) return;

    setMessages(prev => [...prev, { type: 'user', text: prompt }]);
    const currentPrompt = prompt;
    setPrompt('');
    setLoading(true);

    const loadingId = Date.now();
    setMessages(prev => [...prev, { id: loadingId, type: 'bot', isLoading: true }]);

    try {
      const res = await axios.post('http://localhost:5000/api/generate', { prompt: currentPrompt });
      const imageUrl = res.data.images;

      setMessages(prev =>
        prev.map(msg => (msg.id === loadingId ? { type: 'bot', image: imageUrl } : msg))
      );

      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      localStorage.setItem('attempts', newAttempts.toString());
    } catch (err) {
      console.error('Image generation failed', err);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === loadingId ? { type: 'bot', text: 'Image generation failed. Try again.' } : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 p-4 text-center font-bold text-xl bg-gray-800 shadow">
        {user ? (
          <div className="absolute top-4 left-[15%] flex items-center space-x-2 font-normal">
            you have {attempts} attempts remaining!
          </div>
        ) : null}
        Imageify
        {user ? (
          <div className="absolute top-4 right-[15%] flex items-center space-x-2">
            <img
              src={user.picture}
              alt="User Icon"
              className="w-8 h-8 rounded-full mr-3"
            />
            <span className="text-sm pr-5">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-blue-500 ml-7"
            >
              Logout
            </button>
          </div>
        ) : null}
      </header>

      {/* Main content */}
      <main className="flex-grow mt-16 px-4 overflow-y-auto">
        <div className="w-[70%] mx-auto space-y-4 pb-24">
          {messages.map((msg, idx) => (
            <div key={idx} className="mb-4">
              {msg.type === 'user' && (
                <div className="text-right">
                  <p className="inline-block bg-blue-600 px-4 py-2 rounded-lg">{msg.text}</p>
                </div>
              )}
              {msg.type === 'bot' && (
                <div className="text-left">
                  {msg.isLoading ? (
                    <TypingDots />
                  ) : msg.image ? (
                    <img
                      src={msg.image}
                      alt="Generated"
                      className="rounded-lg w-full max-w-lg"
                    />
                  ) : (
                    <p className="inline-block bg-gray-700 px-4 py-2 rounded-lg">{msg.text}</p>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 bg-gray-800 px-4 py-3 flex justify-center"
      >
        <div className="w-[70%] flex">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-grow px-4 py-2 rounded-l-lg bg-gray-700 text-white focus:outline-none"
            placeholder="Describe your image... (this is a minimum accuracy model)"
            disabled={loading || !user}  // Disable if not logged in
            required
          />
          <button
            type="submit"
            className={`px-6 py-2 rounded-r-lg ${loading || !user || attempts <= 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600'}`}
            disabled={loading || !user || attempts <= 0}
          >
            {user ? attempts > 0 ? (loading ? 'Generating...' : 'Generate') : 'out of attempts' : 'Login to generate'}
          </button>
        </div>
      </form>

      {/* Login */}
      {!user && (
        <div className="absolute bottom-[50%] left-1/2 transform -translate-x-1/2">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
            useOneTap
          />
        </div>
      )}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="inline-block bg-gray-700 px-4 py-2 rounded-lg">
      <span className="typing-dot animate-bounce">.</span>
      <span className="typing-dot animate-bounce delay-150">.</span>
      <span className="typing-dot animate-bounce delay-300">.</span>
    </div>
  );
}

export default App;
