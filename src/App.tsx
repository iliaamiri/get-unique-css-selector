import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Get Selector Helper</h1>
      <div className="card">
        <button onClick={() => window.navigator.clipboard.writeText(getSelectorHelpersCode)}>
            Copy getSelectorHelpers code
        </button>
      </div>
    </>
  )
}

export default App

const getSelectorHelpersCode = `var { getSelector, bulkTest, test } = (function () {
    const test = function test(str) {
        const select = document.querySelector(str);

        const output = getSelector(select);

        const allElements = document.querySelectorAll(output);

        return {
            test: allElements.length === 1 ? 'passed' : 'failed',
            output,
            allElements,
        };
    };

    const getSelector = function getSelector(element) {
        function getNodeIdentifier(element, parent) {
            let identifier = element.nodeName.toLowerCase();

            // should not check the id too because it could be random maybe
            if (element.id.length > 0) {
                identifier += '#' + element.id;
            }

            if (parent) {
                const nth = Array.from(parent.children).reduce(
                    (acc, child, i) => (child === element ? i : acc),
                    null,
                );

                if (nth !== null) {
                    identifier += \`:nth-child(\${nth + 1})\`;
                }
            }

            return identifier;
        }

        function createSelectorArray(element, arr = []) {
            if (!element.parentElement) {
                arr.push(getNodeIdentifier(element, null));
                return arr;
            }

            createSelectorArray(element.parentElement, arr);
            arr.push(getNodeIdentifier(element, element.parentElement));
            return arr;
        }

        return createSelectorArray(element).join(' > ');
    };

    const bulkTest = (selectors, failedRecords = []) => {
        Object.keys(selectors).forEach((key) => {
            const node = selectors[key];
            if (typeof node === 'string') {
                const result = document.querySelectorAll(node);
                if (result.length !== 1) {
                    failedRecords.push({
                        key: key,
                        selector: node,
                        elements: result,
                    });
                }

                return;
            }

            bulkTest(node, failedRecords);
        });

        return failedRecords;
    };

    return {
        test,
        bulkTest,
        getSelector,
    };
})();
`
