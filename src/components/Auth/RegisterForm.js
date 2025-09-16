import React from 'react';
import { Link } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import InputField from '../Common/InputField';
import Button from '../Common/Button';

const RegisterForm = ({ onSubmit, loading = false }) => {
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validate
  } = useForm(
    {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      department: ''
    },
    {
      firstName: [
        { required: true, message: 'First name is required' }
      ],
      lastName: [
        { required: true, message: 'Last name is required' }
      ],
      email: [
        { required: true, message: 'Email is required' },
        { pattern: /\S+@\S+\.\S+/, message: 'Please enter a valid email' }
      ],
      password: [
        { required: true, message: 'Password is required' },
        { minLength: 6, message: 'Password must be at least 6 characters' }
      ],
      confirmPassword: [
        { required: true, message: 'Please confirm your password' },
        { 
          custom: (value, allValues) => {
            return value !== allValues.password ? 'Passwords do not match' : null;
          }
        }
      ],
      department: [
        { required: true, message: 'Department is required' }
      ]
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      const { confirmPassword, ...submitData } = values;
      await onSubmit(submitData);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <i className="fas fa-user-plus fa-3x text-primary mb-3"></i>
                  <h3 className="card-title">Create Account</h3>
                  <p className="text-muted">Join our knowledge base community</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <InputField
                        type="text"
                        name="firstName"
                        label="First Name"
                        value={values.firstName}
                        placeholder="Enter first name"
                        error={errors.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <InputField
                        type="text"
                        name="lastName"
                        label="Last Name"
                        value={values.lastName}
                        placeholder="Enter last name"
                        error={errors.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                  </div>
                  
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
                    type="text"
                    name="department"
                    label="Department"
                    value={values.department}
                    placeholder="e.g., IT, HR, Finance"
                    icon="fas fa-building"
                    error={errors.department}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  
                  <div className="row">
                    <div className="col-md-6">
                      <InputField
                        type="password"
                        name="password"
                        label="Password"
                        value={values.password}
                        placeholder="Enter password"
                        icon="fas fa-lock"
                        error={errors.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <InputField
                        type="password"
                        name="confirmPassword"
                        label="Confirm Password"
                        value={values.confirmPassword}
                        placeholder="Confirm password"
                        icon="fas fa-lock"
                        error={errors.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 mb-3"
                    loading={loading}
                    icon="fas fa-user-plus"
                  >
                    Create Account
                  </Button>
                </form>
                
                <div className="text-center">
                  <p className="mb-0">
                    Already have an account? 
                    <Link to="/login" className="text-primary ms-1 text-decoration-none">
                      Sign in here
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

export default RegisterForm;
