import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, CheckCircle, Phone, Mail, ArrowLeft, Loader2, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { catalogApi, contractApi, type TechnicianDetailDto } from '../services/api';

export default function TechnicianDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getToken, user } = useAuth();
  const navigate = useNavigate();
  const [tech, setTech] = useState<TechnicianDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [contractLoading, setContractLoading] = useState(false);
  const [contractSuccess, setContractSuccess] = useState(false);
  const [contractError, setContractError] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDate, setFormDate] = useState('');

  useEffect(() => {
    if (!id) return;
    catalogApi.getTechnician(Number(id), getToken())
      .then(r => setTech(r.data))
      .catch(() => setError('No se pudo cargar el perfil del técnico.'))
      .finally(() => setLoading(false));
  }, [id, getToken]);

  function openModal() {
    if (!user) { navigate('/login'); return; }
    setFormDescription(''); setFormAddress(''); setFormPrice(''); setFormDate('');
    setContractError(''); setContractSuccess(false);
    setShowModal(true);
  }

  async function submitContract() {
    if (!tech) return;
    if (!formDescription.trim()) { setContractError('Por favor describe el trabajo que necesitas.'); return; }
    if (!formAddress.trim()) { setContractError('Por favor ingresa la dirección del servicio.'); return; }
    setContractLoading(true); setContractError('');
    try {
      await contractApi.create({
        technicianId: tech.id,
        description: formDescription,
        address: formAddress,
        agreedPrice: formPrice ? Number(formPrice) : undefined,
        scheduledDate: formDate || undefined,
      }, getToken());
      setContractSuccess(true);
    } catch (e: unknown) {
      setContractError(e instanceof Error ? e.message : 'Error al enviar la solicitud.');
    } finally {
      setContractLoading(false);
    }
  }

  const stars = [1, 2, 3, 4, 5];

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 size={40} className="animate-spin text-primary" />
    </div>
  );

  if (error || !tech) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <AlertCircle size={48} className="text-red-400" />
      <p className="text-text font-semibold">{error || 'Técnico no encontrado'}</p>
      <Link to="/catalog" className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors">
        Volver al catálogo
      </Link>
    </div>
  );

  const formatPrice = (min?: number, max?: number) => {
    if (!min && !max) return 'Precio a consultar';
    if (min && max) return `S/ ${min} – S/ ${max}`;
    if (min) return `Desde S/ ${min}`;
    return `Hasta S/ ${max}`;
  };

  return (
    <>
    <div className="min-h-screen bg-background">
      {/* Back bar */}
      <div className="bg-white border-b border-border sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          <Link to="/catalog" className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">
            <ArrowLeft size={16} /> Volver al catálogo
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-start gap-5">
                {tech.profileImageUrl
                  ? <img src={tech.profileImageUrl} alt={tech.fullName} className="w-24 h-24 rounded-2xl object-cover flex-shrink-0" />
                  : <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">{tech.fullName.charAt(0)}</div>
                }
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-text">{tech.fullName}</h1>
                    {tech.verified && (
                      <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        <CheckCircle size={12} /> Verificado
                      </span>
                    )}
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${tech.available ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-muted'}`}>
                      {tech.available ? 'Disponible' : 'No disponible'}
                    </span>
                  </div>
                  <p className="text-primary font-semibold">{tech.categoryName}</p>
                  <div className="flex items-center gap-1 text-sm text-muted mt-1">
                    <MapPin size={13} /> {tech.districtName}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      {stars.map(s => (
                        <Star key={s} size={16} className={s <= Math.round(tech.averageRating) ? 'fill-warning text-warning' : 'fill-gray-200 text-gray-200'} />
                      ))}
                      <span className="font-bold text-text ml-1">{tech.averageRating?.toFixed(1)}</span>
                      <span className="text-sm text-muted">({tech.totalReviews} reseñas)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: tech.completedJobs, label: 'Trabajos completados' },
                { value: tech.experienceYears != null ? `${tech.experienceYears} años` : '—', label: 'Experiencia' },
                { value: tech.averageRating?.toFixed(1), label: 'Calificación' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-border p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-muted mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Bio */}
            {tech.biography && (
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="text-lg font-bold text-text mb-3">Acerca de mí</h2>
                <p className="text-muted leading-relaxed">{tech.biography}</p>
              </div>
            )}

            {/* Specialties */}
            {tech.specialties?.length > 0 && (
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="text-lg font-bold text-text mb-4">Especialidades</h2>
                <div className="flex flex-wrap gap-2">
                  {tech.specialties.map(s => (
                    <span key={s} className="bg-blue-50 text-primary font-medium text-sm px-4 py-2 rounded-xl">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {tech.reviews && tech.reviews.length > 0 && (
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="text-lg font-bold text-text mb-5">Reseñas ({tech.totalReviews})</h2>
                <div className="space-y-5">
                  {tech.reviews.map(r => (
                    <div key={r.id} className="pb-5 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 bg-background rounded-full flex items-center justify-center text-text font-semibold text-sm">{r.reviewerName.charAt(0)}</div>
                          <span className="font-semibold text-text text-sm">{r.reviewerName}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {stars.map(s => <Star key={s} size={13} className={s <= r.rating ? 'fill-warning text-warning' : 'fill-gray-200 text-gray-200'} />)}
                        </div>
                      </div>
                      {r.comment && <p className="text-sm text-muted leading-relaxed pl-11">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-2xl border border-border p-6 sticky top-20">
              <p className="text-xs text-muted uppercase font-semibold tracking-wider mb-1">Precio estimado</p>
              <p className="text-2xl font-bold text-text mb-5">{formatPrice(tech.minPrice, tech.maxPrice)}</p>

              {tech.available ? (
                <>
                  <button
                    onClick={openModal}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20 mb-3 text-sm"
                  >
                    <CheckCircle size={16} /> Contratar ahora
                  </button>
                  <a href={`tel:${tech.phone}`} className="w-full border border-primary/30 text-primary hover:bg-primary/5 font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3 text-sm">
                    <Phone size={15} /> Llamar
                  </a>
                </>
              ) : (
                <button disabled className="w-full bg-gray-100 text-muted font-semibold py-3 rounded-xl cursor-not-allowed mb-3 text-sm">
                  No disponible
                </button>
              )}

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-sm text-muted">
                  <Mail size={14} className="text-primary flex-shrink-0" /> <span className="truncate">{tech.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted">
                  <Phone size={14} className="text-primary flex-shrink-0" /> <span>{tech.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Hire Modal */}

    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-bold text-text">Solicitar servicio</h2>
              <p className="text-sm text-muted mt-0.5">{tech.fullName} · {tech.categoryName}</p>
            </div>
            <button onClick={() => setShowModal(false)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-background transition-colors text-muted">
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            {contractSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-text mb-2">¡Solicitud enviada!</h3>
                <p className="text-muted text-sm mb-6">El técnico revisará tu solicitud y se pondrá en contacto contigo pronto.</p>
                <button onClick={() => setShowModal(false)} className="bg-primary text-white px-8 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
                  Entendido
                </button>
              </div>
            ) : (
              <>
                {contractError && (
                  <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                    <AlertCircle size={15} className="flex-shrink-0" /> {contractError}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">¿Qué necesitas? <span className="text-red-500">*</span></label>
                    <textarea
                      value={formDescription}
                      onChange={e => setFormDescription(e.target.value)}
                      rows={3}
                      placeholder="Describe el trabajo. Ej: Necesito revisar la instalación eléctrica de mi depa, hay un corto en el cuarto principal..."
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Dirección del servicio <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formAddress}
                      onChange={e => setFormAddress(e.target.value)}
                      placeholder="Av. Arequipa 1234, Miraflores"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">Presupuesto (S/)</label>
                      <input
                        type="number"
                        value={formPrice}
                        onChange={e => setFormPrice(e.target.value)}
                        placeholder="Opcional"
                        min="0"
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">Fecha preferida</label>
                      <input
                        type="datetime-local"
                        value={formDate}
                        onChange={e => setFormDate(e.target.value)}
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border border-border text-muted rounded-xl font-semibold text-sm hover:bg-background transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={submitContract}
                    disabled={contractLoading}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                  >
                    {contractLoading ? <><Loader2 size={15} className="animate-spin" /> Enviando...</> : 'Enviar solicitud'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
