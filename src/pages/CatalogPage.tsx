import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, MapPin, CheckCircle, LogOut, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { catalogApi, type TechnicianCardDto, type CategoryDto, type DistrictDto, type TechnicianSearchParams } from '../services/api';

export default function CatalogPage() {
  const { user, logout, getToken } = useAuth();
  const navigate = useNavigate();

  const [technicians, setTechnicians] = useState<TechnicianCardDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [districts, setDistricts] = useState<DistrictDto[]>([]);
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [districtId, setDistrictId] = useState<number | ''>('');
  const [minRating, setMinRating] = useState<number | ''>('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('averageRating');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    catalogApi.getCategories().then(r => setCategories(r.data)).catch(() => {});
    catalogApi.getDistricts().then(r => setDistricts(r.data)).catch(() => {});
  }, []);

  const doSearch = useCallback((p = 0) => {
    setLoading(true);
    setPage(p);
    const params: TechnicianSearchParams = {
      keyword: keyword || undefined,
      categoryId: categoryId || undefined,
      districtId: districtId || undefined,
      minRating: minRating || undefined,
      available: onlyAvailable ? true : undefined,
      sortBy,
      sortDirection: 'DESC',
      page: p,
      size: 12,
    };
    catalogApi.searchTechnicians(params, getToken())
      .then(r => {
        setTechnicians(r.data.content);
        setTotalPages(r.data.totalPages);
        setTotalElements(r.data.totalElements);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [keyword, categoryId, districtId, minRating, onlyAvailable, sortBy, getToken]);

  useEffect(() => { doSearch(0); }, []);

  const clearFilters = () => {
    setKeyword(''); setCategoryId(''); setDistrictId('');
    setMinRating(''); setOnlyAvailable(false); setSortBy('averageRating');
    setTimeout(() => doSearch(0), 0);
  };

  const formatPrice = (min?: number, max?: number) => {
    if (!min && !max) return 'Consultar precio';
    if (min && max) return `S/ ${min} – S/ ${max}`;
    if (min) return `Desde S/ ${min}`;
    return `Hasta S/ ${max}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-white border-b border-border fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center shadow">
              <span className="text-white font-bold text-base">YQ</span>
            </div>
            <span className="text-xl font-bold text-text">YA QUEDÓ</span>
          </Link>
          <div className="flex items-center gap-3 relative">
            <button onClick={() => setMenuOpen(v => !v)} className="flex items-center gap-2 bg-background hover:bg-border/50 rounded-xl px-3 py-2 transition-colors">
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">{user?.firstName?.charAt(0)}</span>
              </div>
              <span className="text-sm font-medium text-text hidden sm:block">{user?.firstName}</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-border py-2 z-50">
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-text hover:bg-background transition-colors">
                  <User size={15} className="text-muted" /> Mi perfil
                </Link>
                <div className="border-t border-border my-1" />
                <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={15} /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {/* Search header */}
        <div className="bg-white border-b border-border sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text" value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doSearch(0)}
                  placeholder="Buscar técnico, especialidad..."
                  className="w-full pl-11 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button onClick={() => doSearch(0)} className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-primary/20 whitespace-nowrap">
                Buscar
              </button>
              <button onClick={() => setShowFilters(v => !v)} className={`flex items-center gap-2 border rounded-xl px-4 py-3 text-sm font-medium transition-colors ${showFilters ? 'border-primary text-primary bg-blue-50' : 'border-border text-muted hover:bg-background'}`}>
                <SlidersHorizontal size={16} /> Filtros
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Categoría</label>
                  <select value={categoryId} onChange={e => { setCategoryId(e.target.value ? Number(e.target.value) : ''); }} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Todas</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Distrito</label>
                  <select value={districtId} onChange={e => setDistrictId(e.target.value ? Number(e.target.value) : '')} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Todos</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Calificación mínima</label>
                  <select value={minRating} onChange={e => setMinRating(e.target.value ? Number(e.target.value) : '')} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Cualquiera</option>
                    <option value="4.5">4.5+</option>
                    <option value="4">4.0+</option>
                    <option value="3.5">3.5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Ordenar por</label>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="averageRating">Mejor calificado</option>
                    <option value="completedJobs">Más trabajos</option>
                    <option value="experienceYears">Más experiencia</option>
                  </select>
                </div>
                <div className="flex flex-col justify-between">
                  <label className="flex items-center gap-2 cursor-pointer mt-5">
                    <input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} className="w-4 h-4 text-primary rounded" />
                    <span className="text-sm text-text">Solo disponibles</span>
                  </label>
                  <button onClick={clearFilters} className="text-xs text-primary hover:underline mt-2 text-left flex items-center gap-1">
                    <X size={12} /> Limpiar filtros
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted">
              {!loading && <><span className="font-semibold text-text">{totalElements}</span> técnicos encontrados</>}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-border p-5 animate-pulse">
                  <div className="flex gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gray-200 flex-shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : technicians.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={36} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">No encontramos técnicos</h3>
              <p className="text-muted mb-6">Intenta con otros términos o limpia los filtros</p>
              <button onClick={clearFilters} className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors">
                Ver todos
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {technicians.map(tech => (
                  <Link key={tech.id} to={`/technician/${tech.id}`}
                    className="bg-white rounded-2xl border border-border p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col group"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="relative flex-shrink-0">
                        {tech.profileImageUrl
                          ? <img src={tech.profileImageUrl} alt={tech.fullName} className="w-14 h-14 rounded-2xl object-cover" />
                          : <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-bold text-xl">{tech.fullName.charAt(0)}</div>
                        }
                        {tech.available && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text truncate group-hover:text-primary transition-colors">{tech.fullName}</h3>
                        <p className="text-sm text-primary font-medium truncate">{tech.categoryName}</p>
                        <div className="flex items-center gap-1 text-xs text-muted mt-0.5">
                          <MapPin size={11} /> <span className="truncate">{tech.districtName}</span>
                        </div>
                      </div>
                    </div>

                    {tech.specialties?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {tech.specialties.slice(0, 3).map(s => (
                          <span key={s} className="text-xs bg-blue-50 text-primary px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                        {tech.specialties.length > 3 && <span className="text-xs bg-gray-100 text-muted px-2 py-0.5 rounded-full">+{tech.specialties.length - 3}</span>}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-warning text-warning" />
                        <span className="text-sm font-semibold text-text">{tech.averageRating?.toFixed(1)}</span>
                        <span className="text-xs text-muted">({tech.totalReviews})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {tech.verified && (
                          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">
                            <CheckCircle size={11} /> Verificado
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted mt-2">{formatPrice(tech.minPrice, tech.maxPrice)}</p>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button onClick={() => doSearch(page - 1)} disabled={page === 0} className="w-10 h-10 rounded-xl border border-border text-muted hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm">←</button>
                  {Array.from({ length: totalPages }, (_, i) => i)
                    .filter(p => p >= page - 2 && p <= page + 2)
                    .map(p => (
                      <button key={p} onClick={() => doSearch(p)} className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${p === page ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'border border-border text-muted hover:bg-background'}`}>
                        {p + 1}
                      </button>
                    ))}
                  <button onClick={() => doSearch(page + 1)} disabled={page >= totalPages - 1} className="w-10 h-10 rounded-xl border border-border text-muted hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm">→</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
