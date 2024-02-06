export default function Picker({
  className,
  onChange,
  pickedId,
  items
}: {
  className?: string;
  pickedId: string | undefined;
  items: { id: string; name: string }[];
  onChange: (newValue: string) => unknown;
}) {
  return (
    <select
      className={className}
      defaultValue={pickedId}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    >
      {items.map((item, i) => (
        <option value={item.id} key={i}>
          {item.name}
        </option>
      ))}
    </select>
  );
}
