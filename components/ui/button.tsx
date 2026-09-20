import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gold';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          'group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
          {
            'bg-primary text-primary-foreground shadow-sm hover:shadow-navy-glow hover:-translate-y-px active:translate-y-0 dark:shadow-gold-glow': variant === 'default',
            'bg-gradient-to-br from-gold-light via-gold to-gold-dark text-white shadow-gold-glow hover:shadow-gold-glow hover:-translate-y-px active:translate-y-0 dark:text-[hsl(226_45%_10%)]': variant === 'gold',
            'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:-translate-y-px active:translate-y-0': variant === 'destructive',
            'border border-border bg-background/60 shadow-sm hover:border-primary/40 hover:bg-accent hover:text-accent-foreground active:translate-y-px': variant === 'outline',
            'bg-secondary text-secondary-foreground hover:bg-secondary/70 active:translate-y-px': variant === 'secondary',
            'hover:bg-accent/70 hover:text-accent-foreground active:scale-[.98]': variant === 'ghost',
            'text-primary underline-offset-4 hover:underline': variant === 'link',
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3': size === 'sm',
            'h-11 rounded-lg px-8': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };