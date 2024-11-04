import { HealthBar } from '@/app/components/health-bar/HealthBar';

export default function Controls() {
  return (
    <>
      <h1 className="text-3xl font-bold">Controls</h1>
      <p>
        Click on the control when the boss is hit to cause him to take damage.
      </p>
      <div className="pt-2 flex space-x-2">
        <button className="p-2 rounded-md bg-gray-200">HEAD (-5 HP)</button>
        <button className="p-2 rounded-md bg-gray-200">BODY (-2 HP)</button>
      </div>
      <h2 className="pt-2 text-2xl font-bold">Preview</h2>
      <HealthBar />
    </>
  );
}
