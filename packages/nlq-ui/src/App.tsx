import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Spinner,
} from "react-bootstrap";
import { NaturalSQLite } from "nlq";
import { Configuration } from "openai";

const LOCAL_STORAGE_API_KEY = "nlq-ui-api-key";

function App() {
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  const [apiKey, setApiKey] = useState(
    localStorage.getItem(LOCAL_STORAGE_API_KEY) || ""
  );
  const [showModal, setShowModal] = useState(false);
  const [persistKey, setPersistKey] = useState(true);
  const [loading, setIsLoading] = useState(false);

  const translate = async () => {
    if (!apiKey) {
      setShowModal(true);
      return;
    }

    try {
      setIsLoading(true);
      const configuration = new Configuration({
        apiKey,
      });
      const naturalSQLite = new NaturalSQLite({
        schema: "",
        configuration,
      });
      const response = await naturalSQLite.toQueryLanguage(
        naturalLanguageQuery
      );
      setSqlQuery(response);
    } catch (e) {
      alert("Unable to process request, please see console for more details");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>OpenAI API Key Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This demo requires an{" "}
            <a
              href="https://platform.openai.com/account/api-keys"
              target="__blank"
            >
              OpenAPI key
            </a>{" "}
            to work.
          </p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>OpenAI API Key</Form.Label>
              <Form.Control
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Form.Text className="text-muted">
                This API key is only stored locally.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="persist-key"
                label="Persist to local storage"
                checked={persistKey}
                onChange={(e) => setPersistKey(e.target.checked)}
              />
              <Form.Text className="text-muted">
                To remove or change key clear local storage for this browser /
                page.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setApiKey("");
              setShowModal(false);
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (persistKey) {
                localStorage.setItem(LOCAL_STORAGE_API_KEY, apiKey);
              }
              setShowModal(false);
              translate();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Container style={{ paddingTop: "2em" }}>
        <h1>NLQ UI</h1>
        <p>
          Demo UI to preview the use of the{" "}
          <a href="https://www.npmjs.com/package/nlq">nlq</a> library.
        </p>

        <Row>
          <Col>
            <h2>Natural Language</h2>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Enter natural language query here</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={naturalLanguageQuery}
                  disabled={loading}
                  onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                  placeholder="Find all users in the database that have an age greater than 18 and have made more than 2 transactions in the last 3 months."
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={() => translate()}
                disabled={loading}
              >
                {loading && (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                  </>
                )}
                Translate
              </Button>
            </Form>
          </Col>
          <Col xs={1}>{"→"}</Col>
          <Col>
            <h2>Query</h2>
            <Form.Group>
              <Form.Label>Output SQL syntax</Form.Label>
              <Form.Control as="textarea" rows={5} disabled value={sqlQuery} />
            </Form.Group>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
