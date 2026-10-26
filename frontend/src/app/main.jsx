import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '../styles/index.css'

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled Application Render Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0B0F19',
          color: '#F8FAFC',
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '500px',
            background: '#151C2C',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
              Something interrupted display
            </h1>
            <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '20px', lineHeight: 1.5 }}>
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('user')
                sessionStorage.clear()
                window.location.href = '/jobs'
              }}
              style={{
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Reset & Open Jobs Dashboard
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>,
)

