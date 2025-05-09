import Loading from "../../../Loading/Loading";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../../../../handle/handleAuth";
import { clearMessageLogin} from "../../../../redux/messageSlice";
import { toast } from "react-toastify";

const Login = (props) => {
    const loading = useSelector((state) => state.message.loading);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const msgLogin = useSelector((state) => state.message.login?.msg);

    useEffect(() => {
        if (msgLogin) props.dispatch(clearMessageLogin());
    }, []);

    const onLogin = async (e) => {
        //xử lý đăng nhập
        e.preventDefault();
        const user = { username, password }; //payload
        await handleLogin(user, props.dispatch, props.navigate); //gọi hàm handle
    };
    return (
        <div className="form-wrap">
            <form>
                <div className="form-group d-flex">
                    <div className="d-flex label-group">
                        <label>Tên đăng nhập</label>
                        <a onClick={props.onClickActive}>Kích hoạt tài khoản</a>
                    </div>
                    <div className="field-wrap">
                        <input
                            placeholder="Username"
                            required
                            name="username"
                            type="text"
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                            value={username}
                        />
                    </div>
                </div>
                <div className="form-group d-flex">
                    <div className="label-group d-flex">
                        <label>Mật khẩu</label>
                        <a onClick={props.onClickForgetpw}>Quên mật khẩu</a>
                    </div>
                    <div className="field-wrap">
                        <input
                            placeholder="Password"
                            required
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>
                </div>
                <div className="d-flex">
                    <label className="remember-label" htmlFor="remember">
                        <span>Ghi nhớ mật khẩu</span>
                        <input type="checkbox" id="remember"></input>
                        <span className="checkmark"></span>
                    </label>
                </div>
                <button className="rounded-2" onClick={onLogin}>
                    {loading ? <Loading /> : ""}Đăng nhập
                </button>
                <span>{msgLogin || ""}</span>
            </form>
            <span className="register-choose">
                <label>Bạn chưa có tài khoản. </label>
                <a onClick={props.handleChooseRegister}>Đăng ký ngay?</a>
            </span>
        </div>
    );
};

export default Login;