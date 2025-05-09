import Loading from "../../../Loading/Loading";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgetPassword } from "../../../../api/authApi";
import { toast } from "react-toastify";

const ForgetPassword = (props) => {
    ///Quên mật khẩu
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const onForgetPassword = async (e) => {
        //xử lý gọi API gửi mail quên mật khẩu
        e.preventDefault();
        setLoading(true);
        forgetPassword({ email: email })
            .then((res) => {
                toast.success("Đã gửi mật khẩu mới vào email");
            })
            .catch((err) => {
                toast.error(err?.response?.data?.details?.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    return (
        <div className="form-wrap">
            <form>
                <div className="form-group d-flex">
                    <div className="d-flex label-group">
                        <label>Email</label>
                    </div>
                    <div className="field-wrap">
                        <input
                            placeholder="Email"
                            required
                            name="emailActive"
                            type="text"
                            onChange={onChangeEmail}
                            value={email}
                        />
                    </div>
                </div>
                <button className="rounded-2" onClick={onForgetPassword}>
                    {loading ? <Loading /> : ""} Gửi mật khẩu
                </button>
            </form>
        </div>
    );
};

export default ForgetPassword;