import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import Aurora from '../components/Aurora';
import { MISSIONS } from '../config/missions';
import { useAuthContext } from '../context/AuthContext';
import useRanking, { RankEntry } from '../hooks/useRanking';

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#ffd23d,#ff8a3d)',
  'linear-gradient(135deg,#00e0ff,#3d5afe)',
  'linear-gradient(135deg,#ff3d81,#b14dff)',
  'linear-gradient(135deg,#b6ff3d,#00e0a4)',
  'linear-gradient(135deg,#b14dff,#6a3dff)',
];
const grad = (rank: number) => AVATAR_GRADIENTS[(rank - 1) % AVATAR_GRADIENTS.length];
const initial = (name: string) => name.slice(0, 1).toUpperCase();

const Spot: React.FC<{ entry?: RankEntry; place: 'first' | 'second' | 'third' }> = ({ entry, place }) => (
  <div className={`spot ${place}`}>
    {entry ? (
      <>
        <div className="pav" style={{ background: grad(entry.rank), outline: entry.isMe ? '3px solid #fff' : undefined, outlineOffset: 3 }}>
          {place === 'first' && <span className="crown">👑</span>}
          {initial(entry.name)}
        </div>
        <div className="pname">{entry.isMe ? 'Tú' : entry.name}</div>
        <div className="ppts">{entry.points} pts</div>
      </>
    ) : (
      <div className="pname dim" style={{ marginBottom: 8 }}>—</div>
    )}
    <div className="block">{place === 'first' ? 1 : place === 'second' ? 2 : 3}</div>
  </div>
);

// Top 5 de usuarios reales con su puntaje real, actualizado en vivo desde Firebase
const Ranking: React.FC = () => {
  const { user } = useAuthContext();
  const { top, me, total, loading, error } = useRanking(user?.uid);
  const [first, second, third] = top;
  const rest = top.slice(3);

  return (
    <IonPage>
      <IonContent fullscreen>
        <Aurora />
        <div className="page">
          <div className="row between">
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>Ranking <span className="grad-text">Top 5</span></h1>
            <span className="chip live">EN VIVO</span>
          </div>
          <p className="muted" style={{ margin: '6px 0 18px' }}>Jugadores reales · {total} registrado{total === 1 ? '' : 's'}</p>

          {loading ? (
            <div style={{ display: 'grid', placeItems: 'center', padding: 60 }}><IonSpinner name="crescent" /></div>
          ) : error ? (
            <div className="error-box">No se pudo cargar el ranking: {error}. Revisa las reglas de Firestore.</div>
          ) : (
            <>
              <div className="podium">
                <Spot entry={second} place="second" />
                <Spot entry={first} place="first" />
                <Spot entry={third} place="third" />
              </div>

              {rest.map((r, i) => (
                <div key={r.uid} className={`glass rank-row ${r.isMe ? 'me' : ''}`} style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="pos">#{r.rank}</div>
                  <div className="mini" style={{ background: grad(r.rank) }}>{initial(r.name)}</div>
                  <div className="who">
                    <b>{r.isMe ? `${r.name} (tú)` : r.name}</b>
                    <small>{r.completed}/{MISSIONS.length} misiones</small>
                  </div>
                  <div className="pts">{r.points}</div>
                </div>
              ))}

              {me && (
                <div className="glass pad glow-border" style={{ marginTop: 16, textAlign: 'center' }}>
                  <div className="muted" style={{ fontWeight: 600 }}>Tu posición</div>
                  <div className="num grad-text" style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>#{me.rank}</div>
                  <div className="muted">de {total} jugadores · {me.points} pts</div>
                </div>
              )}

              {total < 5 && (
                <p className="note" style={{ marginTop: 16 }}>Hay menos de 5 jugadores. Registra más cuentas para llenar el Top 5.</p>
              )}
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Ranking;
