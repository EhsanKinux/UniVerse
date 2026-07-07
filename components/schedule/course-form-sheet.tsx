"use client";

import { useState } from "react";
import { useFieldArray, useForm, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02Icon, Tick02Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet } from "@/components/ui/sheet";
import { useCourseMutations } from "@/hooks/schedule/use-course-mutations";
import { COURSE_COLORS, type Course, type CourseFormPayload } from "@/lib/api/types";
import { COURSE_TONES, SESSION_TYPE_LABELS, WEEK_DAYS } from "@/lib/meta/schedule-meta";
import { courseFormSchema, emptySession, type CourseFormValues } from "@/lib/validations/schedule";
import { cn } from "@/lib/utils";

/** Map an existing course (or nothing) onto the form's value shape. */
function toFormValues(course: Course | null): CourseFormValues {
  if (!course) {
    return { name: "", professor: "", color: "teal", sessions: [emptySession()] };
  }
  return {
    name: course.name,
    professor: course.professor ?? "",
    color: (COURSE_COLORS as readonly string[]).includes(course.color)
      ? (course.color as CourseFormValues["color"])
      : "teal",
    sessions: course.sessions.map((s) => ({
      dayOfWeek: s.dayOfWeek,
      start: s.start,
      end: s.end,
      room: s.room ?? "",
      type: s.type,
      parity: s.parity,
    })),
  };
}

/** Strip empty optionals so the payload matches the API contract exactly. */
function toPayload(values: CourseFormValues): CourseFormPayload {
  return {
    name: values.name.trim(),
    professor: values.professor.trim() || undefined,
    color: values.color,
    sessions: values.sessions.map((s) => ({
      dayOfWeek: s.dayOfWeek,
      start: s.start,
      end: s.end,
      room: s.room.trim() || undefined,
      type: s.type,
      parity: s.parity,
    })),
  };
}

/**
 * The add/edit bottom sheet. `course === null` creates a new course; otherwise
 * it edits (and can delete) the given one. The Base UI dialog unmounts its
 * content while closed, and the inner form is additionally KEYED by the course
 * id — so every open starts a fresh form seeded from props, with no reset
 * effects to keep in sync.
 */
export function CourseFormSheet({
  open,
  onOpenChange,
  course,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
}) {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={course ? "ویرایش درس" : "افزودن درس"}
      description={
        course ? "مشخصات یا جلسات این درس را تغییر دهید." : "درس جدید را با جلسات هفتگی آن ثبت کنید."
      }
    >
      <CourseForm key={course?.id ?? "new"} course={course} onDone={() => onOpenChange(false)} />
    </Sheet>
  );
}

function CourseForm({ course, onDone }: { course: Course | null; onDone: () => void }) {
  const { createCourse, updateCourse, deleteCourse } = useCourseMutations();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: toFormValues(course),
    mode: "onTouched",
  });

  const sessionsArray = useFieldArray({ control, name: "sessions" });

  const isEdit = course !== null;
  const busy = createCourse.isPending || updateCourse.isPending || deleteCourse.isPending;
  const serverError =
    createCourse.error?.message ?? updateCourse.error?.message ?? deleteCourse.error?.message ?? null;

  function onSubmit(values: CourseFormValues) {
    const payload = toPayload(values);
    const mutation = isEdit
      ? updateCourse.mutateAsync({ id: course.id, payload })
      : createCourse.mutateAsync(payload);
    void mutation.then(onDone).catch(() => undefined);
  }

  function onDelete() {
    if (!isEdit) return;
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    void deleteCourse.mutateAsync(course.id).then(onDone).catch(() => undefined);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-2" noValidate>
        {/* ---- Course fields ---- */}
        <div className="space-y-1.5">
          <label htmlFor="course-name" className="text-xs font-medium text-foreground/80">
            نام درس *
          </label>
          <Input
            id="course-name"
            placeholder="مثلاً ساختمان داده‌ها"
            aria-invalid={!!errors.name}
            className="h-11 rounded-xl text-sm"
            {...register("name")}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="course-professor" className="text-xs font-medium text-foreground/80">
            استاد
          </label>
          <Input
            id="course-professor"
            placeholder="مثلاً دکتر رضایی (اختیاری)"
            aria-invalid={!!errors.professor}
            className="h-11 rounded-xl text-sm"
            {...register("professor")}
          />
          {errors.professor && <p className="text-xs text-destructive">{errors.professor.message}</p>}
        </div>

        <ColorPicker setValue={setValue} watch={watch} />

        {/* ---- Sessions ---- */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground/80">
              جلسات هفتگی ({sessionsArray.fields.length.toLocaleString("fa-IR")})
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => sessionsArray.append(emptySession())}
            >
              <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
              افزودن جلسه
            </Button>
          </div>

          {errors.sessions?.root?.message && (
            <p className="text-xs text-destructive">{errors.sessions.root.message}</p>
          )}
          {typeof errors.sessions?.message === "string" && (
            <p className="text-xs text-destructive">{errors.sessions.message}</p>
          )}

          {sessionsArray.fields.map((field, index) => (
            <SessionFields
              key={field.id}
              index={index}
              register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
              canRemove={sessionsArray.fields.length > 1}
              onRemove={() => sessionsArray.remove(index)}
            />
          ))}
        </div>

        {serverError && (
          <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {serverError}
          </p>
        )}

        {/* ---- Actions ---- */}
        <div className="flex items-center gap-2 pt-1">
          <Button type="submit" disabled={busy} className="h-11 flex-1 rounded-xl text-sm font-bold">
            <HugeiconsIcon icon={Tick02Icon} data-icon="inline-start" />
            {isEdit ? "ذخیره تغییرات" : "ثبت درس"}
          </Button>
          {isEdit && (
            <Button
              type="button"
              variant="destructive"
              disabled={busy}
              onClick={onDelete}
              className="h-11 rounded-xl px-4 text-sm"
            >
              <HugeiconsIcon icon={Delete02Icon} data-icon="inline-start" />
              {confirmingDelete ? "مطمئنم، حذف شود" : "حذف درس"}
            </Button>
          )}
        </div>
      </form>
  );
}

// -----------------------------------------------------------------------------
// Colour picker
// -----------------------------------------------------------------------------

function ColorPicker({
  setValue,
  watch,
}: {
  setValue: UseFormSetValue<CourseFormValues>;
  watch: UseFormWatch<CourseFormValues>;
}) {
  const selected = watch("color");

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-foreground/80">رنگ درس</p>
      <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="رنگ درس">
        {COURSE_COLORS.map((color) => {
          const active = selected === color;
          return (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={color}
              onClick={() => setValue("color", color, { shouldDirty: true })}
              className={cn(
                "flex size-9 items-center justify-center rounded-full transition-all active:scale-90",
                COURSE_TONES[color].swatch,
                active ? "ring-2 ring-foreground/60 ring-offset-2 ring-offset-background" : "opacity-80",
              )}
            >
              {active && <HugeiconsIcon icon={Tick02Icon} size={16} className="text-white" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// One session's fields
// -----------------------------------------------------------------------------

function SessionFields({
  index,
  register,
  setValue,
  watch,
  errors,
  canRemove,
  onRemove,
}: {
  index: number;
  register: UseFormRegister<CourseFormValues>;
  setValue: UseFormSetValue<CourseFormValues>;
  watch: UseFormWatch<CourseFormValues>;
  errors: ReturnType<typeof useForm<CourseFormValues>>["formState"]["errors"];
  canRemove: boolean;
  onRemove: () => void;
}) {
  const day = watch(`sessions.${index}.dayOfWeek`);
  const type = watch(`sessions.${index}.type`);
  const parity = watch(`sessions.${index}.parity`);
  const sessionErrors = errors.sessions?.[index];

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card/60 p-3.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-foreground">جلسه {(index + 1).toLocaleString("fa-IR")}</p>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="حذف جلسه"
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <HugeiconsIcon icon={Delete02Icon} size={15} />
          </button>
        )}
      </div>

      {/* Day chips */}
      <div className="grid grid-cols-6 gap-1.5" role="radiogroup" aria-label="روز هفته">
        {WEEK_DAYS.map((d) => {
          const active = day === d.index;
          return (
            <button
              key={d.index}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setValue(`sessions.${index}.dayOfWeek`, d.index, { shouldDirty: true })}
              className={cn(
                "rounded-xl border py-2 text-xs font-bold transition-all active:scale-95",
                active
                  ? "border-primary/20 bg-primary/12 text-primary"
                  : "border-border bg-background text-muted-foreground",
              )}
            >
              {d.short}
            </button>
          );
        })}
      </div>

      {/* Times */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground">شروع</label>
          <Input
            type="time"
            dir="ltr"
            step={300}
            aria-invalid={!!sessionErrors?.start}
            className="h-10 rounded-xl text-sm tabular-nums"
            {...register(`sessions.${index}.start`)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground">پایان</label>
          <Input
            type="time"
            dir="ltr"
            step={300}
            aria-invalid={!!sessionErrors?.end}
            className="h-10 rounded-xl text-sm tabular-nums"
            {...register(`sessions.${index}.end`)}
          />
        </div>
      </div>
      {(sessionErrors?.start?.message || sessionErrors?.end?.message) && (
        <p className="text-xs text-destructive">
          {sessionErrors?.start?.message ?? sessionErrors?.end?.message}
        </p>
      )}

      {/* Room */}
      <Input
        placeholder="مکان کلاس، مثلاً کلاس ۲۰۴ (اختیاری)"
        aria-invalid={!!sessionErrors?.room}
        className="h-10 rounded-xl text-sm"
        {...register(`sessions.${index}.room`)}
      />

      {/* Type + parity, as two segmented rows */}
      <div className="grid grid-cols-2 gap-2">
        <Segmented
          ariaLabel="نوع جلسه"
          options={(["theory", "practical"] as const).map((v) => ({ value: v, label: SESSION_TYPE_LABELS[v] }))}
          value={type}
          onChange={(v) => setValue(`sessions.${index}.type`, v, { shouldDirty: true })}
        />
        <Segmented
          ariaLabel="هفته برگزاری"
          options={(["all", "odd", "even"] as const).map((v) => ({
            value: v,
            label: v === "all" ? "هر هفته" : v === "odd" ? "فرد" : "زوج",
          }))}
          value={parity}
          onChange={(v) => setValue(`sessions.${index}.parity`, v, { shouldDirty: true })}
        />
      </div>
    </div>
  );
}

/** A tiny pill-style segmented control. */
function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div className="flex rounded-xl border border-border bg-background p-0.5" role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 rounded-[10px] py-1.5 text-[11px] font-medium transition-all",
              active ? "bg-primary/12 text-primary" : "text-muted-foreground",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
