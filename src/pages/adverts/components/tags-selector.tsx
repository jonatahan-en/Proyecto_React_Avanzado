import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { LoadTags } from "@/store/actions";
import {
    getTagsSelector,
    getTagsPendingSelector,
    getTagsErrorSelector,
} from "@/store/selectors";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tags } from "../types";
import { Badge } from "lucide-react";

const tagsClassNames: Record<string, string> = {
    lifestyle:
        "border-chart-1 text-chart-1 data-[state=on]:bg-chart-1 border-2 bg-white data-[state=on]:text-white",
    mobile: "border-chart-2 text-chart-2 data-[state=on]:bg-chart-2 border-2 bg-white data-[state=on]:text-white",
    motor: "border-chart-3 text-chart-3 data-[state=on]:bg-chart-3 border-2 bg-white data-[state=on]:text-white",
    work: "border-chart-4 text-chart-4 data-[state=on]:bg-chart-4 border-2 bg-white data-[state=on]:text-white",
};

export default function TagsSelector({
    onChange,
    className,
}: {
    onChange: (tags: Tags) => void;
    className?: string;
}) {
    const dispatch = useAppDispatch();
    const tags = useAppSelector(getTagsSelector);
    const loading = useAppSelector(getTagsPendingSelector);
    const error = useAppSelector(getTagsErrorSelector);

    useEffect(() => {
        dispatch(LoadTags());
    }, [dispatch]);

    if (error) {
        return <Badge className="text-sm">Error loading tags</Badge>;
    }

    if (!tags || loading) {
        return <Skeleton className="h-9 w-[50%]" />;
    }

    return (
        <ToggleGroup
            type="multiple"
            defaultValue={[]}
            onValueChange={onChange}
            className={className}
        >
            {tags.map((tag) => (
                <ToggleGroupItem
                    key={tag}
                    value={tag}
                    className={tagsClassNames[tag]}
                >
                    {tag}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
}
