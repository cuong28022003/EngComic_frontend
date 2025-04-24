import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Login from "./component/Login";
import Register from "./component/Register";
import ForgetPassword from "./component/ForgetPassword";
import ReActive from "./component/ReActive";

function Auth(props) {
    //component đăng nhập và đăng ký
    const [login, setLogin] = useState(props.choose);

    const [isforgetPasswordForm, setIsforgetPasswordForm] = useState(false);
    const [isActiveForm, setIsActiveForm] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setLogin(props.choose);
        // dispatch(setLoading(false));
    }, []);

    const handleChooseLogin = () => {
        setLogin(true);
    };
    const handleChooseRegister = useCallback(() => {
        setLogin(false);
    });

    const onClickForgetpw = useCallback(() => {
        setIsforgetPasswordForm(true);
    });

    const onClickActive = useCallback(() => {
        setIsActiveForm(true);
    });

    return (
        <div className="auth-wrap">
            {isforgetPasswordForm ? (
                <ForgetPassword />
            ) : isActiveForm ? (
                <ReActive />
            ) : (
                <div>
                    <div className="auth-header">
                        <ul>
                            <li>
                                <a onClick={handleChooseLogin}>Đăng nhập</a>
                            </li>
                            <li>
                                <a onClick={handleChooseRegister}>Đăng ký</a>
                            </li>
                        </ul>
                    </div>
                    <div className="auth-body">
                        {login ? (
                            <Login
                                dispatch={dispatch}
                                navigate={navigate}
                                onClickActive={onClickActive}
                                handleChooseRegister={handleChooseRegister}
                                onClickForgetpw={onClickForgetpw}
                            />
                        ) : (
                            <Register dispatch={dispatch} navigate={navigate} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Auth;