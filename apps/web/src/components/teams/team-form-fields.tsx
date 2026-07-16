import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getTeamImageUrl } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

type Sport = {
    id: number;
    name: string;
};

type TeamFormData = {
    name: string;
    description?: string | undefined;
    logoUrl?: string | undefined;
    sportId: number;
};

type TeamFormFieldsProps = {
    form: UseFormReturn<TeamFormData>;
    sports: Sport[] | undefined;
    isLoadingSports: boolean;
    onSubmit: (values: TeamFormData) => void;
    onCancel: () => void;
    isPending: boolean;
    submitLabel?: string;
};

export function TeamFormFields({
    form,
    sports,
    isLoadingSports,
    onSubmit,
    onCancel,
    isPending,
    submitLabel = 'Enregistrer',
}: TeamFormFieldsProps) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom de l'équipe *</FormLabel>
                            <FormControl>
                                <Input placeholder='Équipe première, U18, Équipe réserve...' {...field} />
                            </FormControl>
                            <FormDescription>Le nom de l'équipe (1-100 caractères)</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='sportId'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sport *</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(Number(value))}
                                value={field.value ? String(field.value) : ''}
                                disabled={isLoadingSports}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Sélectionner un sport' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {(sports || []).map((sport) => (
                                        <SelectItem key={sport.id} value={String(sport.id)}>
                                            {sport.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>Le sport pratiqué par cette équipe</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Description de l'équipe..."
                                    className='resize-none'
                                    rows={4}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Une description optionnelle de l'équipe (max 500 caractères)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='logoUrl'
                    render={({ field }) => {
                        const imageUrl = field.value ? getTeamImageUrl(field.value) : null;
                        return (
                            <FormItem>
                                <FormLabel>Nom du logo (optionnel)</FormLabel>
                                <FormControl>
                                    <Input placeholder='logo.png' {...field} />
                                </FormControl>
                                <FormDescription>Entrez juste le nom du fichier (ex: logo.png)</FormDescription>
                                {imageUrl && (
                                    <div className='mt-3 h-32 w-32 border rounded overflow-hidden'>
                                        <img src={imageUrl} alt='Aperçu' className='w-full h-full object-cover' />
                                    </div>
                                )}
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />

                <div className='flex justify-end gap-4 pt-4'>
                    <Button type='button' variant='outline' onClick={onCancel} disabled={isPending}>
                        Annuler
                    </Button>
                    <Button type='submit' disabled={isPending}>
                        {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
