import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

export const Searchbar = () => {
  return (
    <InputGroup className={"max-w-sm rounded-full"}>
      <InputGroupAddon>
        <HugeiconsIcon icon={Search01Icon} size={16} />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        placeholder="Rechercher un produit..."
        className={"py-1 placeholder:text-sm placeholder:text-input"}
      />
    </InputGroup>
  );
};
