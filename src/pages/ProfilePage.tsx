import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Save, X, CheckCircle, AlertCircle, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileApi, catalogApi, type DistrictDto, type ProfileUpdateDto } from '../services/api';

export default function ProfilePage() {
  const { user, getToken, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [districts, setDistricts] = useState<DistrictDto[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', address: '',
    biography: '', districtId: '' as string | number, preferredPaymentMethod: '',
  });

  useEffect(() => {
    catalogApi.getDistricts().then(r => setDistricts(r.data)).catch(() => {});
    profileApi.getProfile(getToken())
      .then(r => {
        updateUser(r.data);
        fillForm(r.data);
      })
      .catch(() => setError('No se pudo cargar el perfil.'))
      .finally(() => setLoading(false));
  }, []);

  const fillForm = (u: typeof user) => {
    if (!u) return;
    setForm({
      firstName: u.firstName, lastName: u.lastName, phone: u.phone,
      address: u.address ?? '', biography: u.biography ?? '',
      districtId: u.district?.id ?? '',
      preferredPaymentMethod: u.preferredPaymentMethod ?? '',
    });
  };

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSave = async () => {
    if (!form.firstName || !form.lastName || !form.phone) {
      setError('Nombre, apellido y teléfono son obligatorios.');
      return;
    }
    setSaving(true); setError('');
    const dto: ProfileUpdateDto = {
      firstName: form.firstName, lastName: form.lastName, phone: form.phone,
      address: form.address || undefined, biography: form.biography || undefined,
      districtId: form.districtId ? Number(form.districtId) : undefined,
      preferredPaymentMethod: form.preferredPaymentMethod || undefined,
    };
    try {
      const r = await profileApi.updateProfile(dto, getToken());
      updateUser(r.data);
      fillForm(r.data);
      setEditMode(false);
      setSuccess('Perfil actualizado correctamente.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    fillForm(user);
    setError('');
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 size={40} className="animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-white border-b border-border sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to="/catalog" className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">
            <ArrowLeft size={16} /> Catálogo
          </Link>
          <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors">
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text">Mi perfil</h1>
            <p className="text-muted text-sm mt-1">Gestiona tu información personal</p>
          </div>
          {!editMode && (
            <button onClick={() => { setEditMode(true); setSuccess(''); setError(''); }}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-primary/20">
              <Edit2 size={15} /> Editar perfil
            </button>
          )}
        </div>

        {success && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm">
            <CheckCircle size={16} className="flex-shrink-0" /> {success}
          </div>
        )}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            <AlertCircle size={16} className="flex-shrink-0" /> {error}
          </div>
        )}

        {/* Avatar section */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <div className="flex items-center gap-5">
            {user?.profileImageUrl
              ? <img src={user.profileImageUrl} alt={user.firstName} className="w-20 h-20 rounded-2xl object-cover" />
              : <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-bold text-2xl">{user?.firstName?.charAt(0)}</div>
            }
            <div>
              <h2 className="text-xl font-bold text-text">{user?.firstName} {user?.lastName}</h2>
              <p className="text-muted text-sm">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                {user?.roles?.map(r => (
                  <span key={r} className="text-xs bg-blue-50 text-primary font-medium px-2.5 py-1 rounded-full">{r}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="text-lg font-bold text-text mb-6">Información personal</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            {['firstName', 'lastName'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-text mb-2">
                  {field === 'firstName' ? 'Nombre' : 'Apellido'} *
                </label>
                {editMode
                  ? <input type="text" value={form[field as keyof typeof form] as string} onChange={e => set(field, e.target.value)}
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                  : <p className="py-3 px-4 bg-background rounded-xl text-sm text-text">{user?.[field as keyof typeof user] as string || '—'}</p>
                }
              </div>
            ))}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-text mb-2">Correo electrónico</label>
            <p className="py-3 px-4 bg-background rounded-xl text-sm text-text flex items-center gap-2">
              {user?.email} <span className="text-xs text-muted">(no editable)</span>
            </p>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-text mb-2">Teléfono *</label>
            {editMode
              ? <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder="987654321" maxLength={9}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              : <p className="py-3 px-4 bg-background rounded-xl text-sm text-text">{user?.phone || '—'}</p>
            }
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-text mb-2">Distrito</label>
            {editMode
              ? <select value={form.districtId} onChange={e => set('districtId', e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="">Selecciona tu distrito</option>
                  {districts.map(d => <option key={d.id} value={d.id}>{d.name} — {d.city}</option>)}
                </select>
              : <p className="py-3 px-4 bg-background rounded-xl text-sm text-text">
                  {user?.district ? `${user.district.name} — ${user.district.city}` : '—'}
                </p>
            }
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-text mb-2">Dirección</label>
            {editMode
              ? <input type="text" value={form.address} onChange={e => set('address', e.target.value)}
                  placeholder="Av. Principal 123"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              : <p className="py-3 px-4 bg-background rounded-xl text-sm text-text">{user?.address || '—'}</p>
            }
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-text mb-2">Descripción personal</label>
            {editMode
              ? <>
                  <textarea value={form.biography} onChange={e => set('biography', e.target.value)} rows={4} maxLength={1000}
                    placeholder="Cuéntanos sobre ti..."
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                  <p className="text-xs text-muted mt-1">{form.biography.length}/1000</p>
                </>
              : <p className="py-3 px-4 bg-background rounded-xl text-sm text-text min-h-[70px]">{user?.biography || '—'}</p>
            }
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2">Método de pago preferido</label>
            {editMode
              ? <select value={form.preferredPaymentMethod} onChange={e => set('preferredPaymentMethod', e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="">Sin preferencia</option>
                  {['Efectivo', 'Yape', 'Plin', 'Transferencia bancaria', 'Tarjeta de crédito/débito'].map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              : <p className="py-3 px-4 bg-background rounded-xl text-sm text-text">{user?.preferredPaymentMethod || '—'}</p>
            }
          </div>

          {editMode && (
            <div className="flex gap-3 pt-5 border-t border-border">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm shadow-lg shadow-primary/20">
                {saving ? <><Loader2 size={15} className="animate-spin" /> Guardando...</> : <><Save size={15} /> Guardar cambios</>}
              </button>
              <button onClick={cancelEdit} disabled={saving}
                className="flex items-center gap-2 border border-border text-muted hover:text-text hover:bg-background font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                <X size={15} /> Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
