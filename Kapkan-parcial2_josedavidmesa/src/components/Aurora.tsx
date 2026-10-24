// Fondo animado con manchas de color difuminadas. Va con slot="fixed" dentro de IonContent.
const Aurora: React.FC = () => (
  <div className="aurora" slot="fixed" aria-hidden="true">
    <div className="blob b1" />
    <div className="blob b2" />
    <div className="blob b3" />
    <div className="grid" />
  </div>
);

export default Aurora;
