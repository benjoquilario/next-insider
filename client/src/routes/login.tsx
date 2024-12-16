const Login = () => {
  const login = (url: string) => {
    window.location.href = url;
  };

  return (
    <div>
      <button onClick={() => login('http://localhost:5000/auth/github')}>
        Github
      </button>
    </div>
  );
};
export default Login;
