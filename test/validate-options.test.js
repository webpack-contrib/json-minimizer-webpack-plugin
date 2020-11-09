import JsonMinimizerPlugin from "../src";

it("validation", () => {
  /* eslint-disable no-new */
  expect(() => {
    new JsonMinimizerPlugin({ test: /foo/ });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ test: "foo" });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ test: [/foo/] });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ test: [/foo/, /bar/] });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ test: ["foo", "bar"] });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ test: [/foo/, "bar"] });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ test: true });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new JsonMinimizerPlugin({ test: [true] });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new JsonMinimizerPlugin({ include: /foo/ });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ include: "foo" });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ include: [/foo/] });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ include: [/foo/, /bar/] });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ include: ["foo", "bar"] });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ include: [/foo/, "bar"] });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ include: true });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new JsonMinimizerPlugin({ include: [true] });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new JsonMinimizerPlugin({ exclude: /foo/ });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ exclude: "foo" });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ exclude: [/foo/] });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ exclude: [/foo/, /bar/] });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ exclude: ["foo", "bar"] });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ exclude: [/foo/, "bar"] });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ exclude: true });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new JsonMinimizerPlugin({ exclude: [true] });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new JsonMinimizerPlugin({ minimizerOptions: {} });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ minimizerOptions: { replacer: ["test", 2] } });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ minimizerOptions: { replacer: () => {} } });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ minimizerOptions: { replacer: null } });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ minimizerOptions: { space: 2 } });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ minimizerOptions: { space: "  " } });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ minimizerOptions: { space: null } });
  }).not.toThrow();

  expect(() => {
    new JsonMinimizerPlugin({ minimizerOptions: null });
  }).toThrowErrorMatchingSnapshot();

  expect(() => {
    new JsonMinimizerPlugin({ unknown: true });
  }).toThrowErrorMatchingSnapshot();
  /* eslint-enable no-new */
});
