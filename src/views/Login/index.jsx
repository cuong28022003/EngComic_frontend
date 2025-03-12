import "./styles.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessageLogin } from "../../redux/messageSlice";
import { handleLogin } from "../../handle/handleAuth";
import Loading from "../../components/Loading/Loading";

const Login = ({
    navigate,
    onClickActive,
    handleChooseRegister,
    onClickForgetpw,
}) => {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.message.loading);
    const msgLogin = useSelector((state) => state.message.login?.msg);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (msgLogin) dispatch(clearMessageLogin());
    }, []);

    const onLogin = async (e) => {
        e.preventDefault();
        await handleLogin({ username, password }, dispatch, navigate);
    };

    return (
        <div className="form-wrap">
            <form>
                <div className="form-group">
                    <label>Tên đăng nhập</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Mật khẩu</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button onClick={onLogin}>{loading ? <Loading /> : "Đăng nhập"}</button>
                <span>{msgLogin || ""}</span>
            </form>
            <span className="register-choose">
                Bạn chưa có tài khoản?{" "}
                <a onClick={handleChooseRegister}>Đăng ký ngay?</a>
            </span>
        </div>
    );
};

export default Login;
