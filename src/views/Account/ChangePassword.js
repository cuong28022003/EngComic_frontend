import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess } from '../../redux/slice/auth'
import Loading from '../../components/Loading/Loading'
import { toast } from 'react-toastify'
import { handleChangePassword } from '../../handle/handleAccount'

function ChangePassword() {
    const loading = useSelector(state => state.message.loading)
    const [currentPW, setCurrentPW] = useState("")
    const [newPW, setNewPW] = useState("")
    const [newCfPW, setNewCfPW] = useState("")
    const [msgNewPW, setMsgNewPW] = useState("")
    const [msgNewCfPW, setMsgCfNewPW] = useState("")
    const [valid, setValid] = useState({ new: false, cf: false });
    const user = useSelector(state => state.auth.login?.user)
    const dispatch = useDispatch();

    const onChangeCurrentPW = (e) => {
        setCurrentPW(e.target.value)
    }

    const onChangeNewPW = (e) => {
        const value = e.target.value;
        setNewPW(value);

        if (value.length < 8) {
            setMsgNewPW("Mật khẩu phải có ít nhất 8 kí tự.")
            setValid(pre => { return { ...pre, new: false } });
        } else if (value === currentPW) {
            setMsgNewPW("Mật khẩu mới không được trùng với mật khẩu hiện tại.")
            setValid(pre => { return { ...pre, new: false } });
        } else {
            setMsgNewPW("Mật khẩu hợp lý")
            setValid(pre => { return { ...pre, new: true } });
        }
    }

    const onChangeNewCfPW = (e) => {
        const value = e.target.value;
        setNewCfPW(value);

        if (newPW.localeCompare(value) === 0) {
            setMsgCfNewPW("Trùng khớp")
            setValid(pre => { return { ...pre, cf: true } });
        } else {
            setMsgCfNewPW("Mật khẩu không trùng khớp")
            setValid(pre => { return { ...pre, cf: false } });
        }
    }

    const onClickChangePassword = async (e) => {
        e.preventDefault();
        if (valid.new && valid.cf) {
            const params = {
                newPassword: newPW,
                password: currentPW
            }
            handleChangePassword(user, dispatch, loginSuccess, params);
            // Clear các trường input
            setCurrentPW("");
            setNewPW("");
            setNewCfPW("");
            setMsgNewPW("");
            setMsgCfNewPW("");
            setValid({ new: false, cf: false });
        } else {
            toast.error("Vui lòng kiểm tra lại và nhập đầy đủ thông tin mật khẩu!");
        }
    }

    const labelStyle = { minWidth: '100px', display: 'inline-block' };

    return (
        <div className="profile__main">
            <form>
                <div className="group-info">
                    <label htmlFor="" style={labelStyle}>Mật khẩu hiện tại</label>
                    <input type="password" onChange={onChangeCurrentPW} value={currentPW} />
                </div>
                <div className="group-info">
                    <label htmlFor="" style={labelStyle}>Mật khẩu mới</label>
                    <input type="password" onChange={onChangeNewPW} value={newPW} />
                    <span>{msgNewPW}</span>
                </div>
                <div className="group-info">
                    <label htmlFor="" style={labelStyle}>Xác nhận mật khẩu mới</label>
                    <input type="password" onChange={onChangeNewCfPW} value={newCfPW} />
                    <span>{msgNewCfPW}</span>
                </div>
                <div className="d-flex">
                    <button onClick={onClickChangePassword}>
                        {loading ? <Loading /> : 'Đổi mật khẩu'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword
