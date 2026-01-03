import { Accordion, Form } from "react-bootstrap";

const CuotasMercadoPago = ({ cuotasMP = [] }) => (
  <div className="mt-3">
    <h5>Cuotas con MercadoPago</h5>
    {cuotasMP.length > 0 ? (
      <Accordion>
        {cuotasMP.map((grupo, idx) => (
          <Accordion.Item eventKey={idx.toString()} key={idx}>
            <Accordion.Header>
              {grupo.issuer} ({grupo.metodo.toUpperCase()})
            </Accordion.Header>
            <Accordion.Body>
              {grupo.cuotas.map((c, i) => (
                <Form.Check
                  key={i}
                  type="radio"
                  name={`cuotas-${grupo.metodo}`}
                  label={c.recommended_message}
                  value={c.installments}
                />
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    ) : (
      <p className="text-muted">Financiación disponible al pagar con MercadoPago</p>
    )}
  </div>
);

export default CuotasMercadoPago;

