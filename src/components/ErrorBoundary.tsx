import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Hafizabad Health Guide:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-8 shadow-xl border border-slate-200 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-600">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">
              Hafizabad Health Guide — عارضی مسئلہ پیش آیا
            </h1>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              صفحہ لوڈ کرنے میں عارضی دشواری پیش آئی ہے۔ براہ کرم نیچے دیے گئے بٹن پر کلک کر کے صفحہ ریفریش کریں۔
            </p>
            <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-500 font-mono text-left mb-6 overflow-x-auto">
              {this.state.error?.message || 'Unknown runtime error'}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 bg-[#034694] hover:bg-[#023370] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>صفحہ دوبارہ لوڈ کریں (Reload)</span>
              </button>
              <button
                onClick={() => {
                  window.location.href = './';
                }}
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>ہوم پیج پر جائیں</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
