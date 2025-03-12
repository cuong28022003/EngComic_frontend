import "./styles.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleRegister } from "../../handle/handleAuth";
import Loading from "../../components/Loading/Loading";

const Register = ({ navigate }) => {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.message.loading);
    const msgRegister = useSelector((state) => state.message.register?.msg);

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const onRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return;
        await handleRegister({ username, password, email }, dispatch, navigate);
    };

    return (
        <div className="form-wrap">
            <form>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
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
                <div className="form-group">
                    <label>Nhập lại mật khẩu</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button onClick={onRegister}>
                    {loading ? <Loading /> : "Đăng ký"}
                </button>
                <span>{msgRegister || ""}</span>
            </form>
        </div>
    );
};

export default Register;
