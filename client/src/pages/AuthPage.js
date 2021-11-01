import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const {loading, request, error, clearError} = useHttp();
    const [form, setForm] = useState({
        email:'', password:''
    });

    useEffect(() => {
      message(error);
      clearError()
   }, [error, message, clearError] );

   useEffect(() => {
     window.M.updateTextFields()
   }, []);

    const changeHandler = event => {
      setForm( {...form, [event.target.name]: event.target.value })
    }

    
    async function safeRequest(apiPath, fnOnBody) {
      try {
        const data = await request('/api/auth/'+apiPath, 'POST', {...form})
        console.log(data)
        fnOnBody(data)
      } catch (e) {
        console.log("error", e)
      }
    }
    async function loginOnSite() {
      await safeRequest("login", data => {
        auth.login(data.token, data.userId)
      })
    }

    const registerHandler = async () => {
      await safeRequest("register", () => loginOnSite())
    }
    
    const loginHandler = async () => await loginOnSite()
    
    
    return (
      <div className="row">
        <div className="col s6 offset-s3">
          <h1> Shorten the link </h1>
          <div className="card teal lighten-2"> {/* blue darken-1 */}
              <div className="card-content white-text">
                <span className="card-title"> Authentication </span>
                 <div>
                 
                    <div className="input-field">
                        <input 
                            placeholder="Enter email" 
                            id="email" 
                            type="text"
                            name="email"
                            className="yellow-input"
                            value={form.email}
                            onChange={changeHandler}
                        />
                        <label htmlFor="email"> Email </label>
                    </div>

                    <div className="input-field">
                        <input 
                            placeholder="Enter password" 
                            id="password" 
                            type="password"
                            name="password"
                            className="yellow-input"
                            value={form.password}
                            onChange={changeHandler}
                        />
                        <label htmlFor="password"> Password </label>
                    </div>

                  </div>
              </div>
              <div className="card-action">
                <button 
                  className="btn amber darken-2" 
                  style={{marginRight: 10}}
                  onClick={loginHandler}
                  disabled={loading}
                > 
                  Login 
                </button> {/* style писать отдельным файлом! */}
                <button
                  className="btn grey lighten-1 black-text"
                  onClick={registerHandler}
                  disabled={loading}
                > 
                  Registration 
                </button>
              </div>
          </div>
        </div>
      </div>
    );
}