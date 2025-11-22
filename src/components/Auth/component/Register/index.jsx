import Loading from "../../../Loading";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkEmail, checkUsername } from "../../../../api/authApi";
import { handleRegister } from "../../../../handle/handleAuth";
import { toast } from "react-toastify";

const Register = (props) => {
    const loading = useSelector((state) => state.message.loading);
    const [emailRegister, setEmailRegister] = useState("");
    const [usernameRegister, setUsernameRegister] = useState("");
    const [passwordRegister, setPasswordRegister] = useState("");
    const [passwordCfRegister, setPasswordCfRegister] = useState("");

    const [valid, setValid] = useState([false, false, true, true]);
    const [msgUsername, setMsgUsername] = useState("");
    const [msgEmail, setMsgEmail] = useState("");
    const [msgPassword, setMsgPassword] = useState("");
    const [msgCfPassword, setMsgCfPassword] = useState("");
    const msgRegister = useSelector((state) => state.message.register?.msg);

    const regex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; ///regex validate email

    const onRegister = async (e) => {
        //Xử lý gọi API Sign up
        e.preventDefault();
        if (!valid.every((item) => item)) {
            toast.warning("Vui lòng điền các thông tin phù hợp");
            return;
        }
        const user = {
            //payload
            username: usernameRegister,
            password: passwordRegister,
            email: emailRegister,
        };
        await handleRegister(user, props.dispatch, props.navigate); //gọi hàm sign up
    };

    const onChangeEmail = (e) => {
        //validate email
        let email = e.target.value;
        setEmailRegister(e.target.value);
        if (regex.test(email)) {
            checkEmail({ email })
                .then((res) => {
                    let newValid = [...valid];
                    if (res.valid) {
                        newValid[0] = true;
                        setValid(newValid);
                        setMsgEmail("Email hợp lệ");
                    } else {
                        newValid[0] = false;
                        setValid(newValid);
                        setMsgEmail("Email đã tồn tại");
                    }
                    // setMsgEmail(res.message)
                })
                .catch((err) => {
                    let newValid = [...valid];
                    newValid[0] = false;
                    setValid(newValid);
                    console.log(err.response);
                    setMsgEmail(err.response.data?.detail?.message || "");
                });
        } else {
            let newValid = [...valid];
            newValid[0] = false;
            setValid(newValid);
            setMsgEmail("Email không hợp lệ");
        }
    };

    const onChangeUsername = (e) => {
        //validate username
        let username = e.target.value;
        setUsernameRegister(e.target.value);
        if (username.length > 5) {
            checkUsername({ username })
                .then((res) => {
                    let newValid = [...valid];
                    if (res.valid) {
                        newValid[1] = true;
                        setValid(newValid);
                        setMsgUsername("Tên đăng nhập hợp lệ");
                    } else {
                        newValid[1] = false;
                        setValid(newValid);
                        setMsgUsername("Tên đăng nhập đã tồn tại");
                    }
                })
                .catch((err) => {
                    let newValid = [...valid];
                    newValid[1] = false;
                    setValid(newValid);
                    setMsgUsername(err.response.data?.detail?.message || "");
                });
        } else {
            let newValid = [...valid];
            newValid[1] = false;
            setValid(newValid);
            setMsgUsername("Tên đăng nhập có ít nhất 6 kí tự");
        }
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPasswordRegister(password); // Cập nhật mật khẩu mới
        let newValid = [...valid]; // Sao chép trạng thái hợp lệ

        // Kiểm tra độ dài mật khẩu
        if (password.length > 8) {
            newValid[2] = true;
            setMsgPassword("Mật khẩu hợp lệ");
        } else {
            newValid[2] = false;
            setMsgPassword("Mật khẩu phải có ít nhất 9 ký tự");
        }

        // Kiểm tra sự khớp của mật khẩu xác nhận
        if (password === passwordCfRegister) {
            newValid[3] = true;
            setMsgCfPassword("Mật khẩu xác nhận trùng khớp");
        } else {
            newValid[3] = false;
            setMsgCfPassword("Mật khẩu xác nhận không trùng khớp");
        }

        // Cập nhật trạng thái hợp lệ
        setValid(newValid);
    };

    const onChangePasswordCf = (e) => {
        const passwordConfirm = e.target.value;
        setPasswordCfRegister(passwordConfirm); // Cập nhật giá trị mật khẩu xác nhận

        let newValid = [...valid]; // Sao chép trạng thái hợp lệ hiện tại

        // Kiểm tra sự khớp giữa mật khẩu và mật khẩu xác nhận
        if (passwordConfirm === passwordRegister) {
            newValid[3] = true;
            setMsgCfPassword("Mật khẩu xác nhận trùng khớp");
        } else {
            newValid[3] = false;
            setMsgCfPassword("Mật khẩu xác nhận không trùng khớp");
        }

        setValid(newValid); // Cập nhật trạng thái hợp lệ
    };

    return (
        <div className="form-wrap">
            <form>
                <div className="form-group d-flex">
                    <label className="input-label">Email</label>
                    <div className="field-wrap">
                        <input
                            className="input"
                            placeholder="example@gmail.com"
                            required
                            name="emailRegister"
                            type="text"
                            value={emailRegister}
                            onChange={onChangeEmail}
                        />
                    </div>
                    <span className={`${valid[0] ? "success" : "error"}`}>
                        {msgEmail}
                    </span>
                </div>
                <div className="form-group d-flex">
                    <label className="input-label">Tên đăng nhập</label>
                    <div className="field-wrap">
                        <input
                            className="input"
                            required
                            name="usernameRegister"
                            type="text"
                            value={usernameRegister}
                            onChange={onChangeUsername}
                        />
                    </div>
                    <span className={`${valid[1] ? "success" : "error"}`}>
                        {msgUsername}
                    </span>
                </div>
                <div className="form-group d-flex">
                    <label className="input-label">Mật khẩu</label>
                    <div className="field-wrap">
                        <input
                            className="input"
                            required={true}
                            name={"passwordRegister"}
                            type="password"
                            value={passwordRegister}
                            onChange={onChangePassword}
                        />
                    </div>
                    <span className={`${valid[2] ? "success" : "error"}`}>
                        {msgPassword}
                    </span>
                </div>
                <div className="form-group d-flex">
                    <label className="input-label">Nhập lại mật khẩu</label>
                    <div className="field-wrap">
                        <input
                            className="input"
                            required={true}
                            name={"passwordCfRegister"}
                            type="password"
                            value={passwordCfRegister}
                            onChange={onChangePasswordCf}
                        />
                    </div>
                    <span className={`${valid[3] ? "success" : "error"}`}>
                        {msgCfPassword}
                    </span>
                </div>
                <span>{msgRegister}</span>
                <button onClick={onRegister}>
                    {loading ? <Loading /> : ""}Đăng ký
                </button>
            </form>
        </div>
    );
};

export default Register;