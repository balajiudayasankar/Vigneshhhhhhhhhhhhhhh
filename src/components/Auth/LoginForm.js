import React from 'react';
import { Link } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import InputField from '../Common/InputField';
import Button from '../Common/Button';

const LoginForm = ({ onSubmit, loading = false }) => {
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validate
  } = useForm(
    { email: '', password: '' },
    {
      email: [
        { required: true, message: 'Email is required' },
        { pattern: /\S+@\S+\.\S+/, message: 'Please enter a valid email' }
      ],
      password: [
        { required: true, message: 'Password is required' }
      ]
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      await onSubmit(values);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <i className="fas fa-book-open fa-3x text-primary mb-3"></i>
                  <h3 className="card-title">Knowledge Base Portal</h3>
                  <p className="text-muted">Sign in to your account</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <InputField
                    type="email"
                    name="email"
                    label="Email Address"
                    value={values.email}
                    placeholder="Enter your email"
                    icon="fas fa-envelope"
                    error={errors.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  
                  <InputField
                    type="password"
                    name="password"
                    label="Password"
                    value={values.password}
                    placeholder="Enter your password"
                    icon="fas fa-lock"
                    error={errors.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 mb-3"
                    loading={loading}
                    icon="fas fa-sign-in-alt"
                  >
                    Sign In
                  </Button>
                </form>
                
                <div className="text-center">
                  <p className="mb-2">
                    <Link to="/forgot-password" className="text-primary text-decoration-none">
                      Forgot your password?
                    </Link>
                  </p>
                  <p className="mb-0">
                    Don't have an account? 
                    <Link to="/register" className="text-primary ms-1 text-decoration-none">
                      Register here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
