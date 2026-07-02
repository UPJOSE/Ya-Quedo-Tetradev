import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { catalogApi, type DistrictDto } from '../services/api';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '', districtId: '' as string | number,
    acceptedTerms: false,
  });
  const [districts, setDistricts] = useState<DistrictDto[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    catalogApi.getDistricts()
      .then(r => setDistricts(r.data))
      .catch(() => {})
      .finally(() => setLoadingDistricts(false));
  }, []);

  const set = (field: string, value: string | boolean) =>
    setForm(f => ({ ...f, [field]: value }));

  const validate = () => {
    if (!form.firstName || !form.lastName) return 'Ingresa tu nombre completo.';
    if (!form.email) return 'Ingresa tu correo electrónico.';
    if (!form.phone || !/^\d{9}$/.test(form.phone)) return 'El teléfono debe tener 9 dígitos.';
    if (!form.districtId) return 'Selecciona tu distrito.';
    if (!form.password) return 'Ingresa una contraseña.';
    if (form.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(form.password))
      return 'La contraseña debe tener mayúscula, minúscula, número y carácter especial (@$!%*?&).';
    if (form.password !== form.confirmPassword) return 'Las contraseñas no coinciden.';
    if (!form.acceptedTerms) return 'Debes aceptar los términos y condiciones.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
        districtId: Number(form.districtId),
        acceptedTerms: form.acceptedTerms,
      });
      navigate('/catalog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!form.password) return null;
    const checks = [
      form.password.length >= 8,
      /[A-Z]/.test(form.password),
      /[a-z]/.test(form.password),
      /\d/.test(form.password),
      /[@$!%*?&]/.test(form.password),
    ];
    const count = checks.filter(Boolean).length;
    if (count <= 2) return { label: 'Débil', color: 'bg-red-400', width: '30%' };
    if (count <= 3) return { label: 'Media', color: 'bg-yellow-400', width: '60%' };
    return { label: 'Fuerte', color: 'bg-green-500', width: '100%' };
  };
  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-xl">YQ</span>
            </div>
            <span className="text-3xl font-bold text-text">YA QUEDÓ</span>
          </Link>
          <p className="text-muted text-sm">Crea tu cuenta y contrata técnicos verificados</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-border p-8">
          <h2 className="text-2xl font-bold text-text mb-1">Crear cuenta</h2>
          <p className="text-muted text-sm mb-8">Los campos marcados con * son obligatorios</p>

          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Names */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-text mb-2">Nombre *</label>
                <input
                  type="text" value={form.firstName}
                  onChange={e => set('firstName', e.target.value)}
                  placeholder="Juan"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">Apellido *</label>
                <input
                  type="text" value={form.lastName}
                  onChange={e => set('lastName', e.target.value)}
                  placeholder="Pérez"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-text mb-2">Correo electrónico *</label>
              <input
                type="email" value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="tu@email.com" autoComplete="email"
                className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Phone */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-text mb-2">Teléfono * <span className="text-muted font-normal">(9 dígitos)</span></label>
              <input
                type="tel" value={form.phone}
                onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 9))}
                placeholder="987654321" maxLength={9}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* District */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-text mb-2">Distrito *</label>
              {loadingDistricts ? (
                <div className="w-full border border-border rounded-xl px-4 py-3 text-sm text-muted flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Cargando distritos...
                </div>
              ) : (
                <select
                  value={form.districtId}
                  onChange={e => set('districtId', e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Selecciona tu distrito</option>
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name} — {d.city}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-text mb-2">Contraseña *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Mínimo 8 caracteres" autoComplete="new-password"
                  className="w-full border border-border rounded-xl px-4 py-3 pr-12 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors" tabIndex={-1}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted">Fortaleza</span>
                    <span className={strength.label === 'Débil' ? 'text-red-500' : strength.label === 'Media' ? 'text-yellow-600' : 'text-green-600'}>{strength.label}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
                  </div>
                </div>
              )}
              <p className="text-xs text-muted mt-1">Mayúscula, minúscula, número y carácter especial (@$!%*?&)</p>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text mb-2">Confirmar contraseña *</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                  onChange={e => set('confirmPassword', e.target.value)}
                  placeholder="Repite tu contraseña" autoComplete="new-password"
                  className={`w-full border rounded-xl px-4 py-3 pr-12 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    form.confirmPassword && form.password !== form.confirmPassword
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-border focus:ring-primary'
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors" tabIndex={-1}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle size={18} className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox" checked={form.acceptedTerms}
                  onChange={e => set('acceptedTerms', e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-primary rounded border-border focus:ring-primary"
                />
                <span className="text-sm text-muted">
                  Acepto los{' '}
                  <a href="#" className="text-primary underline hover:no-underline">Términos y Condiciones</a>{' '}
                  y la{' '}
                  <a href="#" className="text-primary underline hover:no-underline">Política de Privacidad</a>{' '}
                  de YA QUEDÓ
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Creando cuenta...</> : 'Crear cuenta'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted hover:text-text transition-colors">
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}
